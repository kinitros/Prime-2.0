import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface PixCharge {
    order_id: string;
    qr_code: string;
    qr_code_base64: string;
    copy_paste_code: string;
    expiration_at: string;
}

export interface PixPaymentData {
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    customer_document: string;
    instagram_username: string;
    service_type: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    order_bumps?: any[]; // Array of order bumps
}

export const createPixPayment = async (data: PixPaymentData) => {
    try {
        const response = await axios.post(`${API_URL}/pix/create`, data);
        return response.data;
    } catch (error) {
        console.error('Error creating PIX payment:', error);
        throw error;
    }
};

export const checkPaymentStatus = async (orderId: string) => {
    try {
        const response = await axios.get(`${API_URL}/pix/status/${orderId}`);
        return response.data;
    } catch (error) {
        console.error('Error checking payment status:', error);
        throw error;
    }
};
