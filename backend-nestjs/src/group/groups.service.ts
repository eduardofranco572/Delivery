import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) {}

    async findAll(page: number, limit: number, search?: string) {
        const skip = (page - 1) * limit;
        const take = limit;

        const where = search ? {
        name: { 
            contains: search,
        }
        } : {};

        const [data, total] = await this.prisma.$transaction([
            this.prisma.preferenceGroup.findMany({
                where,
                skip,
                take,
                orderBy: { id: 'desc' }
            }),

            this.prisma.preferenceGroup.count({ where })
        ]);

        return { data, total };
    }

    async findOne(id: number) {
        const group = await this.prisma.preferenceGroup.findUnique({
            where: { id },
        });

        if (!group) {
            throw new NotFoundException(`Grupo com ID ${id} não encontrado.`);
        }

        return group;
    }

    async create(createGroupDto: CreateGroupDto) {
        return await this.prisma.preferenceGroup.create({
            data: createGroupDto,
        });
    }

    async update(id: number, updateGroupDto: UpdateGroupDto) {
        await this.findOne(id);

        return await this.prisma.preferenceGroup.update({
            where: { id },
            data: updateGroupDto,
        });
    }

    async remove(id: number) {
        await this.findOne(id);

        return await this.prisma.preferenceGroup.delete({
            where: { id },
        });
    }
}