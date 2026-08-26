import { Controller, Put, Get, Param, Body, UseInterceptors, UploadedFiles, ParseIntPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { multerUploadConfig } from '../config/multer.config';

@Controller('admin/company')
export class AdminCompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.companyService.findOne(id);
    }

    @Put(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ], multerUploadConfig))
    update(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateCompanyDto: UpdateCompanyDto, 
        @UploadedFiles() files: { logo?: Express.Multer.File[], banner?: Express.Multer.File[] }
    ) {
        return this.companyService.update(id, updateCompanyDto, files);
    }
}