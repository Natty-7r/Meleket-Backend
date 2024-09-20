import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import WinstonLoggerService from './winston-logger.service'
import { ViewLogs } from '../decorators/logger-api.decorator'

@ApiTags('Logs')
@Controller('logs')
export default class WinstonLoggerController {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  @ViewLogs()
  @Get()
  viewLogs() {
    return this.loggerService.viewLogs({})
  }
}
