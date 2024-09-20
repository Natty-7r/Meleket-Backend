import { Injectable } from '@nestjs/common'
import * as Winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
import {
  LogFile,
  LogFileFolder,
  LoggerType,
  LogType,
  TimeUnit,
} from 'src/common/util/types/base.type'
import { ReadLogFileParams } from 'src/common/util/types/params.type'
import {
  calculateTimeFrame,
  compareDates,
} from 'src/common/util/helpers/date.helper'
import {
  getFullPath,
  readFileContent,
  readFileNamesInFolder,
} from 'src/common/util/helpers/file.helper'
import formatLogFiles from 'src/common/util/helpers/formatter.helper'
import { parseLogFile } from 'src/common/util/helpers/parser.helper'
import { LogFileData } from 'src/common/util/types/responses.type'
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
    this.logger.error(message, metadata)
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

  async viewLogs({
    logType,
    endDate,
    startDate,
    timeUnit = TimeUnit.d,
    timeFrame = 1,
  }: ReadLogFileParams) {
    const logFolders: LogFileFolder[] = []
    let logFileDatas: LogFileData[] = []
    let [initialDate, finalDate] = [new Date(), new Date()]
    // check log type
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
    // check end date or calculate time frame
    if (!endDate)
      [initialDate, finalDate] = calculateTimeFrame({
        startDate,
        timeFrame,
        timeUnit,
      })

    //  get log folder paths
    const logFolderPaths = await Promise.all(
      logFolders.map(async (logFolder) =>
        getFullPath({ filePath: `/logs/${logFolder}` }),
      ),
    )
    // read all log files
    const logFileNames = await Promise.all(
      logFolderPaths.map(async (logFolderPath) =>
        readFileNamesInFolder({ folderPath: logFolderPath }),
      ),
    )
    // format log files
    if (logFileNames.length === 1)
      logFileDatas.push(
        ...(await formatLogFiles({
          logType,
          fileNames: logFileNames[0],
        })),
      )
    else {
      logFileDatas.push(
        ...(await formatLogFiles({
          logType: LogType.ACTIVITY,
          fileNames: logFileNames[0],
        })),
        ...(await formatLogFiles({
          logType: LogType.ERROR,
          fileNames: logFileNames[1],
        })),
      )
    }
    // filter by time frame
    logFileDatas = logFileDatas
      .filter((logFileData) => {
        const stratDateComparation = compareDates(initialDate, logFileData.date)
        const endDateComparation = compareDates(finalDate, logFileData.date)

        return (
          (stratDateComparation === 1 || stratDateComparation === 0) &&
          (endDateComparation === 1 || endDateComparation === 0)
        )
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // read log file content
    const rawLogs: LogFile[] = await Promise.all(
      logFileDatas.map(async (logFileData) => ({
        logType: logFileData.logType,
        content: await readFileContent({ filePath: logFileData.fullPath }),
      })),
    )

    // parse logs
    const logs = rawLogs
      .filter((rawLog) => rawLog.content.trim() !== '')
      .map((rawLog) => ({
        logType: rawLog.logType,
        logs: parseLogFile(rawLog),
      }))

    return logs
  }
}
