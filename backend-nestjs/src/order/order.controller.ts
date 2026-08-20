import { Controller, Post, Body, Param, Get, Put, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post(':userId/checkout')
    async checkout(@Param('userId') userId: string, @Body() body: any) {
        return this.orderService.createOrder(Number(userId), body);
    }

    @Get('user/:userId')
    async getUserOrders(@Param('userId') userId: string) {
        return this.orderService.getUserOrders(Number(userId));
    }

    @Put(':orderId/cancel')
    async cancelOrder(@Param('orderId') orderId: string) {
        return this.orderService.cancelOrder(Number(orderId));
    }
}