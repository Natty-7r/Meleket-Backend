import { Global, Module } from '@nestjs/common'
import WinstonLoggerService from './winston-logger.service'
import WinstonLoggerController from './winston-logger.controller'

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
  controllers: [WinstonLoggerController],
})
export default class WinstonLoggerModule {}
