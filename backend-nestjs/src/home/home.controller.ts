import { Controller, Get, Param, Query } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller('home')
export class HomeController {
    constructor(private readonly homeService: HomeService) {}

    @Get('catalog')
    async getCatalog(@Query('companyId') companyId: string) {
        const id = Number(companyId) || 1; 
        return this.homeService.getCatalogService(id);
    }

    @Get('product/:id')
    async getProductDetails(@Param('id') id: string) {
        return this.homeService.getProductDetailsService(parseInt(id, 10));
    }
}