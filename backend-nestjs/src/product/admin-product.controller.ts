import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from './product.service';
import { multerProductConfig } from '../config/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@Controller('admin/product')
@UseGuards(JwtAuthGuard)
export class AdminProductController {
    constructor(private readonly productService: ProductService) {}

    @Get('aux/preferences')
    getPreferences() {
        return this.productService.getPreferenceGroups();
    }

    @Get('aux/categories')
    getCategories() {
        return this.productService.getCategories();
    }

    @Get()
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
    ) {
        const pageNumber = page ? parseInt(page, 10) : 1;
        const limitNumber = limit ? parseInt(limit, 10) : 50;

        return this.productService.findAll(pageNumber, limitNumber, search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Post()
    @UseInterceptors(FileInterceptor('image', multerProductConfig))
    create(@Body() createProductDto: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            createProductDto.prodImageUrl = file.filename;
        }

        return this.productService.create(createProductDto);
    }

    @Put(':id')
    @UseInterceptors(FileInterceptor('image', multerProductConfig))
    async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: any, @UploadedFile() file: Express.Multer.File) {
        if (file) {
            const oldProduct = await this.productService.findOne(id);

            if (oldProduct?.prodImageUrl) {
                const oldImagePath = path.resolve(process.cwd(), 'uploads/company/products/imgs', oldProduct.prodImageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updateProductDto.prodImageUrl = file.filename;
        }

        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const product = await this.productService.findOne(id);

        if (product?.prodImageUrl) {
            const imagePath = path.resolve(process.cwd(), 'uploads/company/products/imgs', product.prodImageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        return this.productService.remove(id);
    }
}