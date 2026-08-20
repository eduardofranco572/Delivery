import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressDto } from './dto/address.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Get('user/:userId')
    async getUserAddresses(@Param('userId') userId: string) {
        return this.addressService.getUserAddresses(Number(userId));
    }

    @Post('user/:userId')
    async createAddress(@Param('userId') userId: string, @Body() data: AddressDto) {
        return this.addressService.createAddress(Number(userId), data);
    }

    @Put(':id')
    async updateAddress(@Param('id') id: string, @Body() data: AddressDto) {
        return this.addressService.updateAddress(Number(id), data);
    }
}