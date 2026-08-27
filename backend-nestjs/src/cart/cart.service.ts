import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, RedisCartState, RedisCartItem } from './dto/cart.dto';

@Injectable()
export class CartService {
    private readonly TTL_SECONDS = 60 * 60 * 12;

    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        private prisma: PrismaService,
    ) {}

    async getCart(userId: number) {
        const cartStr = await this.redis.get(`cart:${userId}`);
        if (!cartStr) {
            return { 
                items: [], 
                cartTotal: 0 
            };
        }

        const cartState: RedisCartState = JSON.parse(cartStr);

        const populatedItems = await Promise.all(
            cartState.items.map(async (item) => {
                if (!item || !item.productId) return null;

                const product = await this.prisma.product.findUnique({
                    where: { id: Number(item.productId) },
                });

                if (!product) return null;

                const preferences = await this.prisma.preference.findMany({
                    where: { id: { in: item.preferenceIds || [] } },
                });

                const basePrice = product.prodPromotionalPrice || product.prodOriginalPrice;
                const prefsPrice = preferences.reduce((sum, pref) => sum + (pref.prefPrice || 0), 0);
                const quantity = Number(item.quantity) || 1;
                const itemTotal = (basePrice + prefsPrice) * quantity;

                const backendUrl = process.env.BASE_URL || 'http://localhost:3000';
                const prodImageUrl = product.prodImageUrl 
                    ? `${backendUrl}/uploads/company/products/imgs/${product.prodImageUrl}`
                    : 'defaultProduct.png';

                return {
                    cartItemId: item.cartItemId,
                    quantity: quantity,
                    observation: item.observation || '',
                    product: { ...product, prodImageUrl },
                    preferences,
                    itemTotal
                };
            })
        );

        const validItems = populatedItems.filter(item => item !== null);

        if (validItems.length !== cartState.items.length) {
            const healedState = {
                items: validItems.map(vi => ({
                    cartItemId: vi.cartItemId,
                    productId: vi.product.id,
                    quantity: vi.quantity,
                    observation: vi.observation,
                    preferenceIds: vi.preferences.map(p => p.id)
                }))
            };
            await this.redis.set(`cart:${userId}`, JSON.stringify(healedState), 'EX', this.TTL_SECONDS);
        }

        const finalCartTotal = validItems.reduce((sum, item) => sum + item.itemTotal, 0);

        return { items: validItems, cartTotal: finalCartTotal };
    }

    async addItemToCart(userId: number, itemData: any) {
        const { productId, quantity, observation, preferenceIds } = itemData;

        if (!productId || !quantity) {
            throw new Error('Payload inválido: productId ou quantity ausente');
        }

        const cartStr = await this.redis.get(`cart:${userId}`);
        const cartState: RedisCartState = cartStr ? JSON.parse(cartStr) : { items: [] };

        cartState.items.push({
            cartItemId: Date.now().toString(),
            productId,
            quantity,
            observation: observation || '',
            preferenceIds: preferenceIds || [],
        });

        await this.redis.set(`cart:${userId}`, JSON.stringify(cartState), 'EX', this.TTL_SECONDS);

        return { 
            message: 'Item adicionado ao carrinho com sucesso', 
            cartItemId: cartState.items[cartState.items.length - 1].cartItemId 
        };
    }

    async updateCartItemQuantity(userId: number, cartItemId: string, quantity: number) {
        const cartStr = await this.redis.get(`cart:${userId}`);

        if (!cartStr) {
            return { message: 'Carrinho não encontrado' };
        }

        const cartState: RedisCartState = JSON.parse(cartStr);
        const itemIndex = cartState.items.findIndex(item => item.cartItemId === cartItemId);

        if (itemIndex > -1) {
            cartState.items[itemIndex].quantity = quantity;
            await this.redis.set(`cart:${userId}`, JSON.stringify(cartState), 'EX', this.TTL_SECONDS);
            
            return { message: 'Quantidade atualizada com sucesso' };
        }

        return { message: 'Item não encontrado no carrinho' };
    }

    async removeCartItem(userId: number, cartItemId: string) {
        const cartStr = await this.redis.get(`cart:${userId}`);
        
        if (!cartStr) {
            return { message: 'Carrinho não encontrado' };
        }

        const cartState: RedisCartState = JSON.parse(cartStr);

        cartState.items = cartState.items.filter(item => item.cartItemId !== cartItemId);

        if (cartState.items.length === 0) {
            await this.redis.del(`cart:${userId}`);

        } else {
            await this.redis.set(`cart:${userId}`, JSON.stringify(cartState), 'EX', this.TTL_SECONDS);
        }

        return { message: 'Item removido do carrinho' };
    }

    async getCartCount(userId: number) {
        const cartStr = await this.redis.get(`cart:${userId}`);
        if (!cartStr) return { count: 0 };

        const cartState: RedisCartState = JSON.parse(cartStr);
        
        const count = cartState.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        return { count };
    }

    async clearCart(userId: number) {
        await this.redis.del(`cart:${userId}`);
        return { message: 'Carrinho esvaziado com sucesso' };
    }
}