import { LoggerType } from 'src/common/types/base.type'

export default interface LoggerStrategy {
  getLoggerConfig(): any
  getLoggerType(): LoggerType
}
