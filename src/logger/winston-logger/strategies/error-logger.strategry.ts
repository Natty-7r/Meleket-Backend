import {
  LogFileFolder,
  LoggerOption,
  LoggerType,
} from 'src/common/types/base.type'
import LoggerStrategy from '../interfaces/logger-strategy.interface'

export default class ErrorLoggerStrategy implements LoggerStrategy {
  private rotationFileRule: LoggerOption

  private loggerType: LoggerType

  constructor(extra?: Record<string, unknown>) {
    this.loggerType = LoggerType.ERROR

    this.rotationFileRule = {
      dirname: `logs/${LogFileFolder.ERROR}`,
      filename: '%DATE%_error.log',
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
