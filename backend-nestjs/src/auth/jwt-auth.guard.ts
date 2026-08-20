import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Token de autenticação não fornecido.');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer' || !token) {
            throw new UnauthorizedException('Formato de token inválido.');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            
            request.user = decoded; 
            
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido ou expirado.');
        }
    }
}