import { Controller, Post, Body, Param, Get, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CheckoutDto } from './dto/order.dto';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Post(':userId/checkout')
    checkout(@Param('userId', ParseIntPipe) userId: number, @Body() body: CheckoutDto) {
        return this.orderService.createOrder(userId, body);
    }

    @Get('user/:userId')
    getUserOrders(@Param('userId', ParseIntPipe) userId: number) {
        return this.orderService.getUserOrders(userId);
    }

    @Put(':orderId/cancel')
    cancelOrder(@Param('orderId', ParseIntPipe) orderId: number) {
        return this.orderService.cancelOrder(orderId);
    }
}