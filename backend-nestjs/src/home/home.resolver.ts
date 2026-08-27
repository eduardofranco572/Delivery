import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { HomeService } from './home.service';
import { Category, Product } from './models/home.graphql';

@Resolver()
export class HomeResolver {
  constructor(private readonly homeService: HomeService) {}

    @Query(() => [Category], { name: 'catalog' })
    async getCatalog(): Promise<Category[]> {
        return this.homeService.getCatalogService();
    }

    @Query(() => Product, { name: 'productDetails' })
    async getProductDetails(
        @Args('id', { type: () => Int }) id: number,
    ): Promise<Product> {
        return this.homeService.getProductDetailsService(id);
    }
}