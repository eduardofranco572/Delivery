import { Product, Preference } from '../../../core/models/domain.models';

export interface CartPayload {
    productId: number;
    quantity: number;
    observation: string;
    preferenceIds: number[];
}

export interface CartItemResponse {
    cartItemId: string;
    quantity: number;
    observation: string;
    product: Product;
    preferences: Preference[];
    itemTotal: number;
}

export interface CartResponse {
    items: CartItemResponse[];
    cartTotal: number;
}