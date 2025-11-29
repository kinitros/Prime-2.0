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

            // Fetch active webhooks that are subscribed to this event
            // We'll fetch all active webhooks and filter in code for simplicity with JSONB
            // or we can use a postgres query if we structure it right. 
            // For now, let's fetch all active and filter.
            const { data: webhooks, error } = await this.supabase
                .from('webhooks')
                .select('*')
                .eq('is_active', true);

            if (error) {
                console.error('[Webhook] Error fetching webhooks:', error);
                return;
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
