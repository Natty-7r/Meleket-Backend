import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import AdminModule from './admin/admin.module'
import AppController from './app.controller'
import AppService from './app.service'
import AuthModule from './auth/auth.module'
import MessageModule from './message/message.module'
import PaymentModule from './payment/payment.module'

import AccessControlModule from './access-control/access-control.module'
import BusinessBaseModule from './business-module/base-business.module'
import CategoryModule from './category/category.module'
import ErrorExceptionFilter from './common/filters/error.filter'
import ActivityInterceptor from './common/interceptors/activity.interceptor'
import configuration from './config/configuration'
import LoggerModule from './logger/logger.module'
import UserModule from './user/user.module'

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
    AccessControlModule,
    AuthModule,
    CategoryModule,
    UserModule,
    AdminModule,
    MessageModule,
    BusinessBaseModule,
    PaymentModule,
  ],

  providers: [
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
    AppService,
  ],

  controllers: [AppController],
})
export default class AppModule {}
