import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async findOne(id: number) {
        const company = await this.prisma.company.findUnique({
            where: { id }
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada.');
        }
        return company;
    }

    async update(id: number, data: UpdateCompanyDto, files?: { 
        logo?: Express.Multer.File[], 
        banner?: Express.Multer.File[] 
    }) {
        const updateData: any = {
            empName: data.empName,
            empNameFantasy: data.empNameFantasy,
            empCnpj: data.empCnpj,
            empCep: data.empCep,
            empStreet: data.empStreet,
            empNeighborhood: data.empNeighborhood,
            empCity: data.empCity,
            empState: data.empState,
            empFreteBase: data.empFreteBase
        };

        if (files?.logo?.length) {
            updateData.empLogo = files.logo[0].filename;
        }
        if (files?.banner?.length) {
            updateData.empBanner = files.banner[0].filename;
        }

        return this.prisma.company.update({
            where: { id },
            data: updateData
        });
    }
}