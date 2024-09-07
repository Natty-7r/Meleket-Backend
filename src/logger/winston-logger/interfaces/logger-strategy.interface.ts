import { LoggerType } from 'src/common/util/types/base.type'

export default interface LoggerStrategy {
  getLoggerConfig(): any
  getLoggerType(): LoggerType
}
