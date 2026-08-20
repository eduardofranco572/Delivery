import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signup(@Body() body: SignupDto) {
        const user = await this.authService.signupService(body);

        return { 
            message: 'Usuário criado com sucesso.', user 
        };
    }

    @Post('login')
    async login(@Body() body: LoginDto) {
        const result = await this.authService.loginService(body);

        return { 
            message: 'Login realizado com sucesso.', ...result 
        };
    }
}