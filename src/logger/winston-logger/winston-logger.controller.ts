import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LogType, TimeUnit } from 'src/common/util/types/base.type'
import WinstonLoggerService from './winston-logger.service'
import { ViewLogs } from '../decorators/logger-api.decorator'

@ApiTags('Logs')
@Controller('logs')
export default class WinstonLoggerController {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  @ViewLogs()
  @Get()
  viewLogs(
    @Query('logType') logType?: LogType,
    @Query('timeUnit') timeUnit?: TimeUnit,
    @Query('timeFrame') timeFrame?: number,
    // @Query('startDate') startDate?: Date,
    // @Query('endDate') endDate?: Date,
  ) {
    return this.loggerService.viewLogs({
      logType,
      timeFrame,
      timeUnit,
      // startDate,
      // endDate,
    })
  }
}
