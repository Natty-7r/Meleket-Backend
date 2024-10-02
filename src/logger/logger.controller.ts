import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { LogType, TimeUnit } from 'src/common/types/base.type'
import { ViewFileLogs, ViewLogs } from './decorators/logger-api.decorator'
import LoggerService from './logger.service'

@ApiTags('Logs')
@Controller('logs')
export default class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ViewFileLogs()
  @Get('/files')
  viewFileLogs(
    @Query('logType') logType?: LogType,
    @Query('timeUnit') timeUnit?: TimeUnit,
    @Query('timeFrame') timeFrame?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.loggerService.getFileLogs({
      logType,
      timeFrame,
      timeUnit,
      startDate,
      endDate,
    })
  }

  @ViewLogs()
  @Get()
  viewLogs(
    @Query('logType') logType?: LogType,
    @Query('timeUnit') timeUnit?: TimeUnit,
    @Query('timeFrame') timeFrame?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.loggerService.getLogs({
      logType,
      timeFrame,
      timeUnit,
      startDate,
      endDate,
    })
  }
}
