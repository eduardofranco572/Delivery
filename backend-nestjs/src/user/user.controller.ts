import { Controller, Get, Put, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.getUser(id); 
    }

    @Put(':id')
    updateUser(@Param('id') id: string, @Body() data: any) {
        return this.userService.updateUser(Number(id), data);
    }
}