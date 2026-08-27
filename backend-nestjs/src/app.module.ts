import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config';
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
import { AdminModule } from './dashboard/dashboard.module';
import { ProductModule } from './product/product.module';
import { PreferencesModule } from './preferences/preferences.module'
import { GroupsModule } from './group/groups.module'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
        }),

        ConfigModule.forRoot({ isGlobal: true }),

        PrismaModule, 
        AuthModule, 
        HomeModule, 
        RedisModule,
        CartModule,
        OrderModule,
        AddressModule,
        CompanyModule,
        UserModule,
        AdminModule,
        ProductModule,
        PreferencesModule,
        GroupsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}