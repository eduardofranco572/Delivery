import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    private async findOrCreateCategory(catName: string): Promise<number> {
        let category = await this.prisma.category.findFirst({
            where: { catName: catName }
        });

        if (!category) {
            category = await this.prisma.category.create({
                data: { catName: catName }
            });
        }

        return category.id;
    }

    async create(data: CreateProductDto) {
        const { preferenceGroupId, prodGroup, prodOriginalPrice, ...rest } = data;

        const existingProduct = await this.prisma.product.findUnique({
            where: { prodCode: rest.prodCode }
        });

        if (existingProduct) {
            throw new BadRequestException('Já existe um produto cadastrado com este código.');
        }

        const categoryId = await this.findOrCreateCategory(prodGroup);

        return this.prisma.product.create({
            data: {
                ...rest,
                prodGroup,
                prodOriginalPrice: Number(prodOriginalPrice),
                category: {
                    connect: { id: categoryId }
                },
                ...(preferenceGroupId ? {
                    preferenceGroups: {
                        connect: { id: Number(preferenceGroupId) }
                    }
                } : {})
            }
        });
    }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        
        const where = search ? {
            OR: [
                { prodName: { contains: search } },
                { prodCode: { contains: search } }
            ]
        } : {};

        const [data, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            }),
            
            this.prisma.product.count({ where })
        ]);

        return { data, total };
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({ 
            where: { id },
            include: { 
                category: true,
                preferenceGroups: true 
            } 
        });

        if (!product) {
            throw new NotFoundException('Produto não encontrado');
        }

        return product;
    }

    async update(id: number, data: CreateProductDto) {
        await this.findOne(id);

        const { preferenceGroupId, prodGroup, prodOriginalPrice, ...rest } = data;
        
        if (rest.prodCode) {
            const existingProduct = await this.prisma.product.findUnique({
                where: { prodCode: rest.prodCode }
            });

            if (existingProduct && existingProduct.id !== id) {
                throw new BadRequestException('Já existe outro produto cadastrado com este código.');
            }
        }

        let categoryId: number | undefined = undefined;

        if (prodGroup) {
            categoryId = await this.findOrCreateCategory(prodGroup);
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...rest, 
                prodOriginalPrice: Number(prodOriginalPrice),
                ...(prodGroup ? { prodGroup } : {}),
                ...(categoryId ? { categoryId } : {}), 
                ...(preferenceGroupId ? {
                    preferenceGroups: {
                        connect: { id: Number(preferenceGroupId) }
                    }
                } : {})
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.product.delete({ where: { id } });
    }

    async getPreferenceGroups() {
        return this.prisma.preferenceGroup.findMany();
    }

    async getCategories() {
        return this.prisma.category.findMany();
    }
}