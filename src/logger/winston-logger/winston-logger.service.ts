import { Injectable, InternalServerErrorException } from '@nestjs/common'
import * as Winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import {
  LogFileFolder,
  LoggerType,
  LogType,
  TimeUnit,
} from 'src/common/util/types/base.type'
import { ReadLogFileParams } from 'src/common/util/types/params.type'
import { calculateTimeFrame } from 'src/common/util/helpers/date.helper'
import {
  getFullPath,
  readFileContent,
  readFileNamesInFolder,
} from 'src/common/util/helpers/file.helper'
import {
  formatActivityLogs,
  formatLogFiles,
} from 'src/common/util/helpers/formatter.helper'
import LoggerStrategy from './interfaces/logger-strategy.interface'

@Injectable()
export default class WinstonLoggerService {
  private stragety: LoggerStrategy

  private logger: Winston.Logger

  loggerType: LoggerType

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

  async getLogs({
    logType,
    endDate = new Date(new Date().setDate(new Date().getDate() + +1)),
    startDate = new Date(new Date().setDate(new Date().getDate() + -1)),
    timeUnit = TimeUnit.D,
    timeFrame = 1,
  }: ReadLogFileParams) {
    const logFolders: LogFileFolder[] = []
    let [initialDate, finalDate] = [startDate, endDate]
    switch (logType) {
      case 'ERROR':
        logFolders.push(LogFileFolder.ERROR)
        break
      case 'ACTIVITY':
        logFolders.push(LogFileFolder.ACTIVITY)
        break
      default:
        logFolders.push(LogFileFolder.ACTIVITY, LogFileFolder.ERROR)
        break
    }
    if (!endDate)
      [initialDate, finalDate] = calculateTimeFrame({
        startDate,
        timeFrame,
        timeUnit,
      })
    const logFolderPaths = await Promise.all(
      logFolders.map(async (logFolder) =>
        getFullPath({ filePath: `/logs/${logFolder}` }),
      ),
    )
    const [activitLogFiles, errorLogFiles] = await Promise.all(
      logFolderPaths.map(async (logFolderPath) =>
        readFileNamesInFolder({ folderPath: logFolderPath }),
      ),
    )
    const formatedActivitLogFiles = await formatLogFiles({
      logType: LogType.ACTIVITY,
      files: activitLogFiles,
    })
    const formatedErrorLogFiles = await formatLogFiles({
      logType: LogType.ERROR,
      files: errorLogFiles,
    })

    // filter by log type
    let logFiles =
      logType === LogType.ACTIVITY
        ? formatedActivitLogFiles
        : logType === LogType.ERROR
          ? formatedErrorLogFiles
          : formatedErrorLogFiles.concat(formatedActivitLogFiles)

    // filter by time frame
    logFiles = logFiles
      .filter((log) => {
        return log.date >= initialDate && log.date <= finalDate
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const logs = await Promise.all(
      logFiles.map(async (log) => {
        const content = await readFileContent({ filePath: log.fullPath })
        return {
          logType: log.logType,
          content: content
            ? log.logType === LogType.ACTIVITY
              ? formatActivityLogs(content)
              : formatActivityLogs(content)
            : '',
        }
      }),
    )
    return logs
  }
}
