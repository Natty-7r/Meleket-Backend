import { LoggerOption, LoggerType } from 'src/common/util/types'
import LoggerStrategy from '../interfaces/logger-strategy.interface'

export default class ActivityLoggerStrategry implements LoggerStrategy {
  private rotationFileRule: LoggerOption

  private loggerType: LoggerType

  constructor(extra?: Record<string, unknown>) {
    this.loggerType = LoggerType.ACTIVITY

    this.rotationFileRule = {
      dirname: 'logs/activities',
      filename: 'USER_MCIROSERVICE-%DATE%-activity.log',
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
