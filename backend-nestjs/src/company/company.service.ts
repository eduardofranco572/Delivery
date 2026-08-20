import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompanyService {
    constructor(private prisma: PrismaService) {}

    async getCompanyInfo(id: number) {
        const company = await this.prisma.company.findUnique({
            where: { id },
            select: {
                id: true,
                empName: true,
                empFreteBase: true
            }
        });

        if (!company) {
            throw new NotFoundException('Empresa não encontrada.');
        }

        return company;
    }
}