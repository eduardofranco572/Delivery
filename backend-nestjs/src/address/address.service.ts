import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddressDto } from './dto/address.dto';

@Injectable()
export class AddressService {
    constructor(private prisma: PrismaService) {}

    async getUserAddresses(userId: number) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' }
        });
    }

    async createAddress(userId: number, data: AddressDto) {
        const { id, ...addressData } = data as any;

        if (addressData.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }

        return this.prisma.address.create({
            data: { ...addressData, userId },
        });
    }

    async updateAddress(addressId: number, data: AddressDto) {
        const { id, ...addressData } = data as any;

        if (addressData.isDefault) {
            const address = await this.prisma.address.findUnique({ where: { id: addressId } });
            
            if (address) {
                await this.prisma.address.updateMany({
                    where: { userId: address.userId },
                    data: { isDefault: false },
                });
            }
        }

        return this.prisma.address.update({
            where: { id: addressId },
            data: addressData,
        });
    }
}