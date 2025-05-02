import { apiJwtService } from './apiJwtService';

interface VipSubscriptionRequest {
    paymentMethod: string;
    months: number;
    transactionId: string;
}

export const subscribeVip = async (data: VipSubscriptionRequest): Promise<boolean> => {
    try {
        const response = await apiJwtService({
            endpoint: '/api/vip/subscribe',
            method: 'POST',
            data
        });
        return response.data;
    } catch (error) {
        console.error('Error subscribing to VIP:', error);
        throw error;
    }
};

export const checkVipStatus = async (): Promise<boolean> => {
    try {
        const response = await apiJwtService({
            endpoint: '/api/vip/status',
            method: 'GET'
        });
        return response.data;
    } catch (error) {
        console.error('Error checking VIP status:', error);
        return false;
    }
}; 