import { Controller, Get, Post, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

   @Get(':userId')
    getUserCart(@Param('userId', ParseIntPipe) userId: number) {
        return this.cartService.getCart(userId);
    }

    @Post(':userId/add')
    addItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() body: AddCartItemDto
    ) {
        return this.cartService.addItemToCart(userId, body);
    }

    @Post(':userId/item/:cartItemId/quantity')
    updateQuantity(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('cartItemId') cartItemId: string,
        @Body() body: { quantity: number }
    ) {
        return this.cartService.updateCartItemQuantity(userId, cartItemId, body.quantity);
    }

    @Delete(':userId/item/:cartItemId')
    removeItem(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('cartItemId') cartItemId: string
    ) {
        return this.cartService.removeCartItem(userId, cartItemId);
    }

    @Get(':userId/count')
    getCartCount(@Param('userId', ParseIntPipe) userId: number) {
        return this.cartService.getCartCount(userId);
    }
}