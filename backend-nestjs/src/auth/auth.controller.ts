import { Controller, Post, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() body: SignupDto) {
        const user = await this.authService.signupService(body);
        return { message: 'Usuário criado com sucesso.', user };
    }

    @Post('login')
    async login(
        @Body() body: LoginDto, 
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.loginService(body);

        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 86400000
        });

        return { 
             message: 'Login realizado com sucesso.', 
             user: result.user 
        };
    }
}