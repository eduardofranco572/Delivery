import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import cookieParser = require('cookie-parser');

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.use(cookieParser());

    app.enableCors({
        origin: 'http://localhost:4200',
        credentials: true,
    });

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );
    
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
    });
    
    const configService = app.get(ConfigService);
    
    const port = configService.get<number>('PORT') || 3000;
    
    await app.listen(port);
    console.log(`Backend rodando na porta ${port}!`);
}

bootstrap();