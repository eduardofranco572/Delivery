import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignupDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

    async signupService(userData: SignupDto) {
        const { name, email, password } = userData;
        
        const userExists = await this.prisma.user.findUnique({ where: { email } });
            if (userExists) {
            throw new HttpException('Este e-mail já está em uso.', HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        const { password: _, ...userWithoutPassword } = newUser;

        return userWithoutPassword;
    }

    async loginService(credentials: LoginDto) {
        const { email, password } = credentials;
        
        const user = await this.prisma.user.findUnique({ where: { email } });

        if (!user) {
            throw new HttpException('Usuário não encontrado.', HttpStatus.UNAUTHORIZED);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new HttpException('E-mail ou senha incorretos.', HttpStatus.UNAUTHORIZED);
        }

        const token = jwt.sign(
            { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        return { 
            user: userWithoutPassword, 
            token 
        };
    }
}