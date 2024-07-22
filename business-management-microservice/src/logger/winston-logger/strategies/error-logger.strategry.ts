import { LoggerOption, LoggerType } from 'src/common/util/types'
import LoggerStrategy from '../interfaces/logger-strategy.interface'

export default class ErrorLoggerStrategy implements LoggerStrategy {
  private rotationFileRule: LoggerOption

  private loggerType: LoggerType

  constructor(extra?: Record<string, unknown>) {
    this.loggerType = LoggerType.ERROR

    this.rotationFileRule = {
      dirname: 'logs/errors',
      filename: 'USER_MCIROSERVICE-%DATE%-error.log',
      level: 'error',
      ...extra,
    }
  }

  getLoggerConfig() {
    return this.rotationFileRule
  }

  getLoggerType() {
    return this.loggerType
  }
}
