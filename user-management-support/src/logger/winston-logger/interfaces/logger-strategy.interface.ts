import { LoggerType } from 'src/common/util/types'

export default interface LoggerStrategy {
  getLoggerConfig(): any
  getLoggerType(): LoggerType
}
