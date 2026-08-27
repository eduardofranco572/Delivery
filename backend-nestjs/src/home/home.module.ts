import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeResolver } from './home.resolver';

@Module({
    controllers: [HomeController],
    providers: [HomeService, HomeResolver],
})
export class HomeModule {}
