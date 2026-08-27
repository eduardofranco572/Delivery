import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        
        let token = request.cookies?.token;

        if (!token) {
            const authHeader = request.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }

        if (!token) {
            throw new UnauthorizedException('Token de autenticação não fornecido.');
        }

        try {
            const secret = this.configService.get<string>('JWT_SECRET')!;
            const decoded = jwt.verify(token, secret);
            request.user = decoded; 
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }
    }
}