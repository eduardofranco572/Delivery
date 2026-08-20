import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUser(Number(id));
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() data: any) {
        return this.userService.updateUser(Number(id), data);
    }
}