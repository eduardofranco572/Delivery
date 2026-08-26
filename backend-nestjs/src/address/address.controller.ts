import { Controller, Get, Post, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AddressService } from './address.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressDto } from './dto/address.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @Get('user/:userId')
    async getUserAddresses(@Param('userId', ParseIntPipe) userId: number) {
        return this.addressService.getUserAddresses(userId);
    }

    @Post('user/:userId')
    async createAddress(@Param('userId', ParseIntPipe) userId: number, @Body() data: AddressDto) {
        return this.addressService.createAddress(userId, data);
    }

    @Put(':id')
    async updateAddress(@Param('id', ParseIntPipe) id: number, @Body() data: AddressDto) {
        return this.addressService.updateAddress(id, data);
    }
}