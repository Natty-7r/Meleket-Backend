import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import ProfileModule from './profile/profile.module'
import UserModule from './user/user.module'
import AppController from './app.controller'
import AppService from './app.service'
import WinstonLoggerModule from './logger/winston-logger/winston-logger.module'
import ErrorExceptionFilter from './common/filters/error.filter'
import ActivityInterceptor from './common/interceptors/activity.interceptor'

@Module({
  imports: [WinstonLoggerModule, ProfileModule, UserModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ErrorExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ActivityInterceptor },
  ],
})
export default class AppModule {}
