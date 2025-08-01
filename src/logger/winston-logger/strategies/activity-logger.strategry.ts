import {
  LogFileFolder,
  LoggerOption,
  LoggerType,
} from 'src/common/types/base.type'
import LoggerStrategy from '../interfaces/logger-strategy.interface'

export default class ActivityLoggerStrategry implements LoggerStrategy {
  private rotationFileRule: LoggerOption

  private loggerType: LoggerType

  constructor(extra?: Record<string, unknown>) {
    this.loggerType = LoggerType.ACTIVITY

    this.rotationFileRule = {
      dirname: `logs/${LogFileFolder.ACTIVITY}`,
      filename: '%DATE%_activity.log',
      level: 'info',
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
