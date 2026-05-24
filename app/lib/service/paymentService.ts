import { API_ROUTES } from '../constant';
import { CapturePaymentRequest, PaymentOrderRequest, PaymentOrderResponse } from '../definitions';
import apiJwtService from './apiJwtService';

export const paymentService = {
  createPayment: async (data: PaymentOrderRequest): Promise<PaymentOrderResponse> => {
    const response = await apiJwtService({
      endpoint: API_ROUTES.PAYMENTS_CREATE,
      method: 'POST',
      data: {
        paymentMethod: 'PAYPAL',
        ...data
      },
    });
    return response;
  },

  capturePayment: async (data: CapturePaymentRequest): Promise<{ status: string; message: string }> => {
    const response = await apiJwtService({
      endpoint: API_ROUTES.PAYMENTS_CAPTURE,
      method: 'POST',
      data,
    });
    return response;
  },

  getPrices: async (): Promise<{ MONTHLY: number; YEARLY: number }> => {
    const response = await apiJwtService({
      endpoint: API_ROUTES.PAYMENTS_PRICES,
      method: 'GET',
    });
    return response;
  },
};
