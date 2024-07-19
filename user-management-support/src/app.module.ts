import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ClientsModule, Transport } from '@nestjs/microservices'

import ProfileModule from './profile/profile.module'
import AuthModule from './auth/auth.module'
import AppController from './app.controller'
import AppService from './app.service'
import WinstonLoggerModule from './logger/winston-logger/winston-logger.module'
import ErrorExceptionFilter from './common/filters/error.filter'
import ActivityInterceptor from './common/interceptors/activity.interceptor'
import PrismaModule from './prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: 'USER_MANAGEMENT_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'user-management',
            brokers: ['127.0.0.1:9092'],
          },
          consumer: {
            groupId: 'user-management-consumer',
          },
        },
      },
    ]),
    WinstonLoggerModule,
    ProfileModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
  ],
})
export default class AppModule {}
