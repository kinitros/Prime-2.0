const { createClient } = require('@supabase/supabase-js');

class SupabaseService {
    constructor() {
        // We need to use the service role key for backend operations to bypass RLS if needed, 
        // or just the anon key if we rely on public policies. 
        // For now, let's assume we use the same URL and Key as frontend but ideally should be Service Role.
        // Since I don't have the Service Role Key, I'll use the one from the environment or hardcoded if user didn't provide it in .env
        // But wait, the user's project likely has a .env with SUPABASE_URL and SUPABASE_KEY.
        // I'll check .env later. For now, I'll use process.env variables.

        this.supabaseUrl = process.env.SUPABASE_URL || 'https://pksvfeetsgkomyjknmxw.supabase.co';
        this.supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!this.supabaseKey) {
            console.warn('Supabase Key not found in environment variables!');
        }

        this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
    }

    async createTransaction(data) {
        try {
            console.log('SupabaseService: Creating transaction...', JSON.stringify(data, null, 2));
            const { data: transaction, error } = await this.supabase
                .from('orders')
                .insert([data])
                .select()
                .single();

            if (error) {
                console.error('=== SUPABASE INSERT ERROR ===');
                console.error('Error Code:', error.code);
                console.error('Error Message:', error.message);
                console.error('Error Details:', JSON.stringify(error.details, null, 2));
                console.error('Error Hint:', error.hint);
                console.error('Full Error:', JSON.stringify(error, null, 2));
                console.error('===========================');
                return { success: false, error: error.message };
            }

            return { success: true, data: transaction };
        } catch (error) {
            console.error('SupabaseService Catch Error:', error);
            return { success: false, error: error.message };
        }
    }

    async updateTransaction(orderId, updates) {
        try {
            console.log(`SupabaseService: Updating transaction ${orderId}...`, updates);
            // Assuming order_id is the custom ID we generated, not the UUID PK. 
            // If order_id is the PK, we use .eq('id', orderId). 
            // The user's code uses `order_id` as a custom column.

            const { data, error } = await this.supabase
                .from('orders')
                .update(updates)
                .eq('order_id', orderId)
                .select()
                .single();

            if (error) {
                console.error('Supabase Update Error:', error);
                return { success: false, error: error.message };
            }

            return { success: true, data: data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTransactionByPixId(pixId) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select('*')
                .eq('pix_id', pixId)
                .single();

            if (error) return { success: false, error: error.message };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getTransactionByOrderId(orderId) {
        try {
            const { data, error } = await this.supabase
                .from('orders')
                .select('*')
                .eq('order_id', orderId)
                .single();

            if (error) return { success: false, error: error.message };
            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

module.exports = { SupabaseService };
