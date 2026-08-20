import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { RedisModule } from './redis/redis.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { AddressModule } from './address/address.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
      PrismaModule, 
      AuthModule, 
      HomeModule, 
      RedisModule,
      CartModule,
      OrderModule,
      AddressModule,
      CompanyModule,
      UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}