const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');

class WebhookService {
    constructor() {
        this.supabaseUrl = process.env.SUPABASE_URL;
        this.supabaseKey = process.env.SUPABASE_KEY;
        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    async trigger(event, payload) {
        try {
            console.log(`[Webhook] Triggering event: ${event}`);

            // Tenta buscar via RPC (seguro) primeiro, fallback para SELECT normal
            let webhooks = [];
            
            // Tentativa 1: RPC (recomendado para contornar RLS)
            const { data: rpcData, error: rpcError } = await this.supabase
                .rpc('get_active_webhooks');

            if (!rpcError && rpcData) {
                webhooks = rpcData;
            } else {
                // Tentativa 2: Select direto (funciona se RLS permitir ou usar Service Key)
                if (rpcError) console.log('[Webhook] RPC get_active_webhooks not found or error, trying direct select...');
                
                const { data: selectData, error: selectError } = await this.supabase
                    .from('webhooks')
                    .select('*')
                    .eq('is_active', true);

                if (selectError) {
                    console.error('[Webhook] Error fetching webhooks:', selectError);
                    return;
                }
                webhooks = selectData || [];
            }

            if (!webhooks || webhooks.length === 0) {
                console.log('[Webhook] No active webhooks found.');
                return;
            }

            const promises = webhooks.map(async (webhook) => {
                // Check if webhook is subscribed to this event
                // events is a JSON array of strings
                if (webhook.events && Array.isArray(webhook.events) && webhook.events.includes(event)) {
                    try {
                        console.log(`[Webhook] Sending to ${webhook.url}`);
                        await axios.post(webhook.url, {
                            event,
                            data: payload,
                            timestamp: new Date().toISOString()
                        });
                        console.log(`[Webhook] Successfully sent to ${webhook.url}`);
                    } catch (err) {
                        console.error(`[Webhook] Failed to send to ${webhook.url}:`, err.message);
                    }
                }
            });

            await Promise.all(promises);

        } catch (error) {
            console.error('[Webhook] Unexpected error:', error);
        }
    }
}

module.exports = new WebhookService();
