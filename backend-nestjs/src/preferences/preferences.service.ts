import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePreferenceDto } from './dto/create-preference.dto';
import { UpdatePreferenceDto } from './dto/update-preference.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PreferencesService {
    constructor(private prisma: PrismaService) {}

    async create(createPreferenceDto: CreatePreferenceDto) {
        const { groupIds, ...data } = createPreferenceDto;

        return this.prisma.preference.create({
            data: {
                ...data,
                groups: groupIds && groupIds.length > 0 ? {
                    connect: groupIds.map(id => ({ id }))
                } : undefined,
            },
        });
    }

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        
        const where = search ? {
        OR: [
            { prefName: { contains: search } },
            { prefCode: { contains: search } }
        ]
        } : {};

        const [data, total] = await this.prisma.$transaction([
            this.prisma.preference.findMany({
                where,
                skip,
                take: limit,
                orderBy: { id: 'desc' }
            }),
            this.prisma.preference.count({ where })
        ]);

        return { data, total };
    }

    async findOne(id: number) {
        const preference = await this.prisma.preference.findUnique({ 
            where: { id },
            include: { groups: true }
        });
        
        if (!preference) {
            throw new NotFoundException('Preferência não encontrada');
        }

        return preference;
    }

    async update(id: number, updatePreferenceDto: UpdatePreferenceDto) {
        await this.findOne(id);
        
        const { groupIds, ...data } = updatePreferenceDto;

        return this.prisma.preference.update({
            where: { id },
            data: {
                ...data,
                groups: groupIds ? {
                    set: groupIds.map(id => ({ id }))
                } : undefined,
            },
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.preference.delete({ where: { id } });
    }
}