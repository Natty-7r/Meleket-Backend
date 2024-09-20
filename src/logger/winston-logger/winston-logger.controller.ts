import { Controller, Get } from '@nestjs/common'
import Public from 'src/common/decorators/public.decorator'
import WinstonLoggerService from './winston-logger.service'

@Controller('logs')
export default class WinstonLoggerController {
  constructor(private readonly loggerService: WinstonLoggerService) {}

  @Public()
  @Get()
  getLogs() {
    return this.loggerService.getLogs({})
  }
}
