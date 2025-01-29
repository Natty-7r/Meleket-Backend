import { Controller, Get, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ViewFileLogs, ViewLogs } from './decorators/logger-api.decorator'
import { FileLogQueryDto } from './dto/file-log-query.dto'
import { LogQueryDto } from './dto/log-query.dto'
import LoggerService from './logger.service'

@ApiTags('Logs')
@Controller('logs')
export default class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @ViewFileLogs()
  @Get('/files')
  viewFileLogs(@Query() query?: FileLogQueryDto) {
    return this.loggerService.getFileLogs(query)
  }

  @ViewLogs()
  @Get()
  viewLogs(@Query() query?: LogQueryDto) {
    return this.loggerService.getLogs(query)
  }
}
