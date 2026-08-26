import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
    constructor(
        private prisma: PrismaService,
        private configService: ConfigService
    ) {}

    private formatProductImage(imageUrl: string | null): string {
        if (!imageUrl) {
            return 'defaultProduct.png';
        }

        const backendUrl = this.configService.get<string>('BASE_URL');
        
        return `${backendUrl}/uploads/company/products/imgs/${imageUrl}`;
    }

    async getCatalogService() {
        const categories = await this.prisma.category.findMany({
            include: {
                products: { 
                     take: 20, 
                     orderBy: { prodRating: 'desc' } 
                 },
            },
        });
        
        return categories.map(category => ({
            ...category,
            products: category.products.map(product => ({
                ...product,
                prodImageUrl: this.formatProductImage(product.prodImageUrl),
            })),
        }));
    }

    async getProductDetailsService(productId: number) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            include: {
                category: true,
                preferenceGroups: {
                    include: { preferences: true },
                },
            },
        });

        if (!product) {
            throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
        }

        return {
            ...product,
            prodImageUrl: this.formatProductImage(product.prodImageUrl),
        };
    }
}