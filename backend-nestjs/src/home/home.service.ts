import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HomeService {
    constructor(private prisma: PrismaService) {}

    private formatProductImage(imageUrl: string | null, productId: number): string {
        if (!imageUrl) {
            return 'defaultProduct.png';
        }

        const backendUrl = process.env.BASE_URL || 'http://localhost:3000';

        return `${backendUrl}/uploads/produtos/${productId}/${imageUrl}`;
    }

    async getCatalogService(companyId: number) {
        const categories = await this.prisma.category.findMany({
            where: { companyId },
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
                prodImageUrl: this.formatProductImage(product.prodImageUrl, product.id),
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
            prodImageUrl: this.formatProductImage(product.prodImageUrl, product.id),
        };
    }
}