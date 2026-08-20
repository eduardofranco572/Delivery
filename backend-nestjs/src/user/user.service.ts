import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ){}

    async getUser(id: number){
        const user = await this.prisma.user.findUnique({
            where: {id},
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
            },
        });

        if (!user){
            throw new NotFoundException('Usuário não encontrado');
        }

        return user;
    }

    async updateUser(id: number, data: any){
        return this.prisma.user.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email,
            },
            select: {
                id: true, 
                name: true,
                email: true
            },
        });
    }
}
