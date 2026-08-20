import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

   @Get(':userId')
    async getUserCart(@Param('userId') userId: string) {
        return this.cartService.getCart(Number(userId));
    }

    @Post(':userId/add')
    async addItem(
        @Param('userId') userId: string,
        @Body() body: AddCartItemDto
    ) {
        return this.cartService.addItemToCart(Number(userId), body);
    }

    @Post(':userId/item/:cartItemId/quantity')
    async updateQuantity(
        @Param('userId') userId: string,
        @Param('cartItemId') cartItemId: string,
        @Body() body: { quantity: number }
    ) {
        return this.cartService.updateCartItemQuantity(Number(userId), cartItemId, body.quantity);
    }

    @Delete(':userId/item/:cartItemId')
    async removeItem(
        @Param('userId') userId: string,
        @Param('cartItemId') cartItemId: string
    ) {
        return this.cartService.removeCartItem(Number(userId), cartItemId);
    }

    @Get(':userId/count')
    async getCartCount(@Param('userId') userId: string) {
        return this.cartService.getCartCount(Number(userId));
    }
}