import { Injectable } from '@nestjs/common'
import { ReadLogFileParams } from 'src/common/util/types/params.type'
import WinstonLoggerService from './winston-logger/winston-logger.service'

@Injectable()
export default class LoggerService {
  constructor(private readonly winstonLoggerService: WinstonLoggerService) {}

  async viewLogs(params: ReadLogFileParams) {
    return this.winstonLoggerService.viewLogs(params)
  }
}
