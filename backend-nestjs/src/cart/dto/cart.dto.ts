export class AddCartItemDto {
    productId!: number;
    quantity!: number;
    observation!: string;
    preferenceIds!: number[];
}

export interface RedisCartItem {
    cartItemId: string;
    productId: number;
    quantity: number;
    observation: string;
    preferenceIds: number[];
}

export interface RedisCartState {
    items: RedisCartItem[];
}