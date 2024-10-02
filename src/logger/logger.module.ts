import { Global, Module } from '@nestjs/common'
import LoggerService from './logger.service'
import LoggerController from './logger.controller'
import WinstonLoggerModule from './winston-logger/winstone-logger.module'

@Global()
@Module({
  providers: [LoggerService],
  imports: [WinstonLoggerModule],
  controllers: [LoggerController],
})
export default class LoggerModule {}
