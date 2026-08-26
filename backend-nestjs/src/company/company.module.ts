import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { AdminCompanyController } from './admin-company.controller';

@Module({
  controllers: [CompanyController, AdminCompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}