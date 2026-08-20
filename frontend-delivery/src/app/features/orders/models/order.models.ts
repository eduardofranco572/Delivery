import { Product, Preference } from '../../../core/models/domain.models';

export interface OrderItemResponse {
    id: number;
    quantity: number;
    observation: string;
    itemTotal: number;
    product: Product;
    preferences: Preference[];
}

export interface OrderResponse {
    id: number;
    status: string;
    paymentMethod: string;
    changeFor: number | null;
    freightValue: number;
    subtotal: number;
    total: number;
    deliveryAddress: string;
    createdAt: string;
    items: OrderItemResponse[];
}

export interface CancelOrderResponse {
    message: string;
    order: OrderResponse;
}