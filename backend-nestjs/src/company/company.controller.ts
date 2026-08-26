import { Controller, Get, Param } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.companyService.findOne(Number(id));
    }
}