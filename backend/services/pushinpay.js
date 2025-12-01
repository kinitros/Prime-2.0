const axios = require('axios');

class PushInPayService {
    constructor(token) {
        this.token = token;
        this.baseUrl = 'https://api.pushinpay.com.br/api';
    }

    async createPixCharge(data) {
        try {
            console.log('PushInPayService: Creating PIX charge...');
            console.log('Input data:', data);

            // Convert to centavos (API expects integer in centavos)
            const valueInCentavos = Math.round(data.value * 100);

            // Payload exactly as API documentation shows
            const payload = {
                value: valueInCentavos,
                webhook_url: process.env.WEBHOOK_URL || `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/webhook/pushinpay`,
                split_rules: []
            };

            console.log('PushInPay Payload:', JSON.stringify(payload, null, 2));

            const response = await axios.post(
                `${this.baseUrl}/pix/cashIn`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                }
            );

            console.log('PushInPay Response:', JSON.stringify(response.data, null, 2));
            return { success: true, data: response.data };
        } catch (error) {
            console.error('PushInPay Error:', error.message);
            if (error.response) {
                console.error('Response Status:', error.response.status);
                console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
            }
            return { success: false, error: error.response?.data?.message || error.message };
        }
    }

    async checkPixStatus(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/pix/cashIn/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/json'
                }
            });
            return { success: true, data: response.data };
        } catch (error) {
            console.error('PushInPay Check Status Error:', error.response?.data || error.message);
            return { success: false, error: error.message };
        }
    }
}

module.exports = { PushInPayService };
