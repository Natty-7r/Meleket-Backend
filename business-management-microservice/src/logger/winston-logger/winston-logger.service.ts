import { Injectable } from '@nestjs/common'
import * as Winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import { LoggerType } from 'src/common/util/types'
import LoggerStrategy from './interfaces/logger-strategy.interface'

@Injectable()
export default class WinstonLoggerService {
  private stragety: LoggerStrategy
  private logger: Winston.Logger
  loggerType: LoggerType
  constructor() {}

  configure(stragety: LoggerStrategy) {
    this.stragety = stragety
    this.loggerType = this.stragety.getLoggerType()

    // define logger ratation file based on logger type
    this.logger = Winston.createLogger({
      format: Winston.format.combine(
        Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        Winston.format.json(),
      ),
      transports: [
        new DailyRotateFile({
          datePattern: 'YYYY-MM-DD',
          maxSize: '20mb',
          maxFiles: '14d',
          ...this.stragety.getLoggerConfig(),
        }),
      ],
    })

    if (process.env.NODE_ENV !== 'production') {
      const consoleTransport = new Winston.transports.Console({
        format: Winston.format.combine(
          Winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          Winston.format.simple(),
          Winston.format.colorize(),
        ),
      })
      this.logger.add(consoleTransport)
    }
  }

  log(message: string, metadata?: Record<string, unknown>) {
    this.logger.info(message, metadata)
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.logger.error(message, { ...metadata })
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.logger.warn(message, metadata)
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.logger.debug(message, metadata)
  }

  verbose(message: string, metadata?: Record<string, unknown>) {
    this.logger.verbose(message, metadata)
  }
}
