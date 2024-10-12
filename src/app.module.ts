import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import PaymentModule from './payment/payment.module'
import AppController from './app.controller'
import AppService from './app.service'
import MessageModule from './message/message.module'
import AuthModule from './auth/auth.module'

import ErrorExceptionFilter from './common/filters/error.filter'
import ActivityInterceptor from './common/interceptors/activity.interceptor'
import CategoryModule from './category/category.module'
import configuration from './config/configuration'
import UserModule from './user/user.module'
import BusinessModule from './business/business.module'
import LoggerModule from './logger/logger.module'
import JwtAuthGuard from './auth/guards/jwt.guard'
import AccessControlModule from './access-control/access-control.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'), // Set the root path for static files
      serveRoot: '/', // This is the root path for serving static files
      serveStaticOptions: {
        // Serve the README.md file as a static file at the root path
        index: false,
      },
    }),
    LoggerModule,
    CategoryModule,
    AuthModule,
    MessageModule,
    BusinessModule,
    UserModule,
    PaymentModule,
    AccessControlModule,
  ],

  providers: [
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    AppService,
  ],

  controllers: [AppController],
})
export default class AppModule {}
