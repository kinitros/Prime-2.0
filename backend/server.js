const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { PushInPayService } = require('./services/pushinpay');
const { SupabaseService } = require('./services/supabase');
const webhookService = require('./services/webhook');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://www.seguidoresprimex.com',
        'https://seguidoresprimex.com'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded data

// Initialize Services
const pushInPayService = new PushInPayService(process.env.PUSHIN_PAY_TOKEN || '');
const supabaseService = new SupabaseService();

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Create PIX Charge
app.post('/api/pix/create', async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            customer_phone,
            customer_document,
            instagram_username,
            service_type,
            quantity,
            unit_price,
            total_amount,
            selected_posts,
            platform_id,
            profile_username,
            order_bumps // Extract order_bumps
        } = req.body;

        console.log('Received PIX Create Request:', req.body);

        // Basic Validation
        if (!customer_name || !customer_email || !total_amount) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos. Nome, e-mail e total são obrigatórios.',
            });
        }

        // Generate unique order_id
        const order_id = `PIX-${Date.now()}-${uuidv4().slice(0, 8)}`;

        // Create transaction in Supabase with status "pending"
        const transaction = await supabaseService.createTransaction({
            customer_name,
            customer_email,
            customer_phone,
            customer_whatsapp: customer_phone, // Legacy field
            customer_document,
            customer_cpf: customer_document, // Legacy field  
            order_id,
            instagram_username,
            service_type,
            quantity,
            unit_price,
            total_amount,
            status: 'pending',
            payment_method: 'pix',
            // New fields
            selected_posts: selected_posts ? JSON.stringify(selected_posts) : null,
            platform_id: platform_id || null,
            // Store order bumps in metadata
            metadata: {
                order_bumps: order_bumps || []
            },
            // Legacy fields with null values
            link: profile_username || instagram_username,
            product_id: null,
            service_offer_id: null,
            profile_data: null,
            subtotal: null,
            discount: null,
            has_order_bump: (order_bumps && order_bumps.length > 0) || false
        });

        if (!transaction.success) {
            return res.status(500).json({
                success: false,
                error: 'Erro ao criar transação no banco de dados',
                details: transaction.error
            });
        }

        // Create charge in PushIn Pay
        const pixResponse = await pushInPayService.createPixCharge({
            value: total_amount,
            customer_name,
            customer_email,
            customer_phone,
            customer_document,
            order_id,
        });

        if (!pixResponse.success || !pixResponse.data) {
            return res.status(500).json({
                success: false,
                error: pixResponse.error || 'Erro ao criar cobrança PIX na Pushin Pay',
            });
        }

        // Update transaction with PIX data
        const updatedTransaction = await supabaseService.updateTransaction(order_id, {
            pix_id: pixResponse.data.id,
            pix_qr_code: pixResponse.data.qr_code,
            pix_qr_code_base64: pixResponse.data.qr_code_base64,
            pix_copy_paste_code: pixResponse.data.qr_code, // Use qr_code as copy_paste_code
            pix_expiration_at: pixResponse.data.expiration_at,
            pushin_pay_transaction_id: pixResponse.data.id,
        });

        // Trigger Webhook: order.created
        webhookService.trigger('order.created', {
            order_id,
            customer: {
                name: customer_name,
                email: customer_email,
                phone: customer_phone,
                document: customer_document
            },
            items: [{
                service_type,
                quantity,
                unit_price,
                total_amount,
                link: profile_username || instagram_username
            }],
            payment: {
                method: 'pix',
                status: 'pending',
                pix_data: {
                    qr_code: pixResponse.data.qr_code,
                    copy_paste: pixResponse.data.qr_code
                }
            },
            created_at: new Date().toISOString()
        });

        if (!updatedTransaction.success) {
            console.error('Failed to update transaction with PIX data:', updatedTransaction.error);
        }

        res.json({
            success: true,
            data: {
                order_id,
                qr_code: pixResponse.data.qr_code,
                qr_code_base64: pixResponse.data.qr_code_base64,
                copy_paste_code: pixResponse.data.qr_code,
                expiration_at: pixResponse.data.expiration_at,
            },
        });
    } catch (error) {
        console.error('[PIX Create] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
            details: error.message
        });
    }
});

// Check PIX Status
app.get('/api/pix/status/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // Fetch transaction from DB
        const transaction = await supabaseService.getTransactionByOrderId(orderId);

        if (!transaction.success || !transaction.data) {
            return res.status(404).json({
                success: false,
                error: 'Transação não encontrada',
            });
        }

        // If not paid, check PushIn Pay
        if (transaction.data.status === 'pending' && transaction.data.pix_id) {
            const pixStatus = await pushInPayService.checkPixStatus(transaction.data.pix_id);

            if (pixStatus.success && pixStatus.data) {
                // Update status if changed
                if (pixStatus.data.status === 'paid') {
                    const updateResult = await supabaseService.updateTransaction(orderId, {
                        status: 'paid',
                        paid_at: pixStatus.data.paid_at,
                    });

                    if (updateResult.success) {
                        transaction.data.status = 'paid';
                        transaction.data.paid_at = pixStatus.data.paid_at;

                        // Trigger Webhook: order.approved
                        webhookService.trigger('order.approved', {
                            order_id: orderId,
                            status: 'paid',
                            approved_at: new Date().toISOString(),
                            customer: {
                                name: transaction.data.customer_name,
                                email: transaction.data.customer_email,
                                phone: transaction.data.customer_phone,
                                document: transaction.data.customer_document
                            },
                            items: [{
                                service_type: transaction.data.service_type,
                                quantity: transaction.data.quantity,
                                unit_price: transaction.data.unit_price,
                                total_amount: transaction.data.total_amount,
                                link: transaction.data.link || transaction.data.instagram_username,
                                platform: transaction.data.platform_id
                            }],
                            payment: {
                                method: transaction.data.payment_method,
                                total: transaction.data.total_amount
                            },
                            metadata: {
                                ...transaction.data.metadata,
                                selected_posts: transaction.data.selected_posts || []
                            }
                        });
                    }
                }
            }
        }

        res.json({
            success: true,
            data: {
                order_id: transaction.data.order_id,
                status: transaction.data.status,
                paid_at: transaction.data.paid_at,
                total_amount: transaction.data.total_amount,
            },
        });
    } catch (error) {
        console.error('[PIX Status] Error:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor',
        });
    }
});

// Webhook endpoint to receive PushinPay notifications
app.post('/api/webhook/pushinpay', async (req, res) => {
    try {
        console.log('[PushinPay Webhook] ===== WEBHOOK RECEIVED =====');
        console.log('[PushinPay Webhook] Headers:', JSON.stringify(req.headers, null, 2));
        console.log('[PushinPay Webhook] Body:', JSON.stringify(req.body, null, 2));
        console.log('[PushinPay Webhook] Query:', JSON.stringify(req.query, null, 2));
        console.log('[PushinPay Webhook] =============================');

        // Acknowledge receipt immediately
        res.status(200).json({ success: true, message: 'Webhook received' });

        const pixId = (req.body.transaction_id || req.body.id || '').toLowerCase(); // Convert to lowercase for DB search

        if (pixId) {
            console.log(`[PushinPay Webhook] Processing webhook for PIX ID: ${pixId}`);

            // 1. Find transaction by pix_id in our DB
            const { data: transactions, error } = await supabaseService.supabase
                .from('orders')
                .select('*')
                .eq('pix_id', pixId)
                .limit(1);

            if (error || !transactions || transactions.length === 0) {
                console.error('[PushinPay Webhook] Transaction not found for pix_id:', pixId);
                return;
            }

            const transaction = transactions[0];
            console.log(`[PushinPay Webhook] Found transaction ${transaction.order_id}`);

            // 2. Check if payment is confirmed (use webhook status directly)
            const webhookStatus = req.body.status;

            if (webhookStatus === 'paid') {
                console.log(`[PushinPay Webhook] Payment confirmed via webhook for PIX ID: ${pixId}`);

                // 3. Update transaction status
                const updateResult = await supabaseService.updateTransaction(transaction.order_id, {
                    status: 'paid',
                    paid_at: new Date().toISOString(),
                });

                if (updateResult.success) {
                    console.log(`[PushinPay Webhook] Transaction ${transaction.order_id} marked as paid`);

                    // Trigger internal webhook
                        webhookService.trigger('order.approved', {
                            order_id: transaction.order_id,
                            status: 'paid',
                            approved_at: new Date().toISOString(),
                            pix_id: pixId,
                            customer: {
                                name: transaction.customer_name,
                                email: transaction.customer_email,
                                phone: transaction.customer_phone,
                                document: transaction.customer_document
                            },
                            items: [{
                                service_type: transaction.service_type,
                                quantity: transaction.quantity,
                                unit_price: transaction.unit_price,
                                total_amount: transaction.total_amount,
                                link: transaction.link || transaction.instagram_username,
                                platform: transaction.platform_id
                            }],
                            payment: {
                                method: transaction.payment_method,
                                total: transaction.total_amount
                            },
                            metadata: {
                                ...transaction.metadata,
                                selected_posts: transaction.selected_posts || [] // Include detailed posts info
                            }
                        });
                } else {
                    console.error('[PushinPay Webhook] Failed to update transaction:', updateResult.error);
                }
            } else {
                console.log(`[PushinPay Webhook] Payment status from webhook is not 'paid': ${webhookStatus}`);
            }
        } else {
            console.log('[PushinPay Webhook] No transaction_id or id found in payload');
        }
    } catch (error) {
        console.error('[PushinPay Webhook] Error processing webhook:', error);
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});