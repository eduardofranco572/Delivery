import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
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
        return this.productService.findAll(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 50,
        search
        );
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

}