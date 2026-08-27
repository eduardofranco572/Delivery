import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { CartItemInput, CartAddResponse } from './models/cart.graphql';

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

    @Mutation(() => CartAddResponse)
    async addToCart(
        @Args('userId', { type: () => Int }) userId: number,
        @Args('input', { type: () => CartItemInput }) input: CartItemInput
    ) {
    return this.cartService.addItemToCart(userId, input);
    }
}