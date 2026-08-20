import { Address, CompanyInfo } from '../../../core/models/global.models';

export interface PlaceOrderPayload {
    companyId: number;
    paymentMethod: string;
    changeFor: string | null;
    freightValue: number;
    address: Address;
}

export interface PlaceOrderResponse {
    message: string;
    orderId: number;
}