import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        private prisma: PrismaService,
        private cartService: CartService
    ) {}

    async createOrder(userId: number, payload: any) {
        const { companyId, paymentMethod, changeFor, freightValue, address } = payload;
        const cart = await this.cartService.getCart(userId);
        
        if (!cart || cart.items.length === 0) {
            throw new HttpException('Carrinho está vazio.', HttpStatus.BAD_REQUEST);
        }

        const subtotal = cart.cartTotal;
        const total = subtotal + freightValue;

        try {
            const order = await this.prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        userId,
                        companyId,
                        paymentMethod,
                        changeFor: changeFor ? parseFloat(changeFor) : null,
                        freightValue,
                        subtotal,
                        total,
                        deliveryAddress: JSON.stringify(address),
                        status: 'PENDING',
                    }
                });

                // Loop para salvar cada item do carrinho
                for (const item of cart.items) {
                    const orderItem = await tx.orderItem.create({
                        data: {
                            orderId: newOrder.id,
                            productId: item.product.id,
                            quantity: item.quantity,
                            observation: item.observation,
                            itemTotal: item.itemTotal,
                        }
                    });

                    // Salva as preferencias de cada item
                    if (item.preferences && item.preferences.length > 0) {
                        await tx.orderItemPreference.createMany({
                            data: item.preferences.map((pref: any) => ({
                                orderItemId: orderItem.id,
                                preferenceId: pref.id
                            }))
                        });
                    }
                }

                return newOrder;
            });

            await this.cartService.clearCart(userId);
            return { message: 'Pedido finalizado com sucesso!', orderId: order.id };

        } catch (error) {
            this.logger.error('Erro ao processar o pedido:', error);
            throw new HttpException(
                'Erro interno ao processar o pedido. Tente novamente.', 
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async getUserOrders(userId: number) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                        preferences: {
                            include: {
                                preference: true
                            }
                        }
                    }
                }
            }
        });

        const backendUrl = process.env.BASE_URL || 'http://localhost:3000';

        return orders.map(order => ({
            ...order,
            items: order.items.map(item => ({
                id: item.id,
                quantity: item.quantity,
                observation: item.observation,
                itemTotal: item.itemTotal,
                product: {
                    ...item.product,
                    prodImageUrl: item.product.prodImageUrl
                        ? `${backendUrl}/uploads/produtos/${item.product.id}/${item.product.prodImageUrl}`
                        : 'defaultProduct.png'
                },

                preferences: item.preferences.map(p => p.preference)
            }))
        }));
    }

    async cancelOrder(orderId: number) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });

        if (!order) {
            throw new HttpException('Pedido não encontrado.', HttpStatus.NOT_FOUND);
        }

        if (order.status !== 'PENDING' && order.status !== 'PREPARING') {
            throw new HttpException('O pedido já avançou e não pode ser cancelado.', HttpStatus.BAD_REQUEST);
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });

        return { message: 'Pedido cancelado com sucesso.', order: updatedOrder };
    }
}