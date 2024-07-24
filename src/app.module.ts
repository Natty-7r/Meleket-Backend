import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import AuthModule from './auth/auth.module'

import WinstonLoggerModule from './logger/winston-logger/winston-logger.module'
import ErrorExceptionFilter from './common/filters/error.filter'
import ActivityInterceptor from './common/interceptors/activity.interceptor'
import PrismaModule from './prisma/prisma.module'
import CategoryModule from './category/category.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: '60s' },
    }),
    PrismaModule,
    ClientsModule.register([
      {
        name: 'BUSINESS_MANAGEMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'business-management',
            brokers: ['127.0.0.1:9092'],
          },
          consumer: {
            groupId: 'business-management-consumer',
          },
        },
      },
    ]),
    WinstonLoggerModule,
    CategoryModule,
    AuthModule,
  ],

  providers: [
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
  ],
})
export default class AppModule {}
