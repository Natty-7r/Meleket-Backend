import { Injectable } from '@nestjs/common'
import { LogParams } from 'src/common/types/params.type'
import PrismaService from 'src/prisma/prisma.service'
import { Cron } from '@nestjs/schedule'
import { ARCHIVED_LOG_EXPIRATION_DATE } from 'src/common/constants'
import { calculateTimeFrame } from 'src/common/helpers/date.helper'
import CreateLogDto from './dto/create-log.dto'
import WinstonLoggerService from './winston-logger/winston-logger.service'

@Injectable()
export default class LoggerService {
  constructor(
    private readonly winstonLoggerService: WinstonLoggerService,
    private readonly prismaService: PrismaService,
  ) {}

  async createLog(createLogDto: CreateLogDto) {
    await this.prismaService.log.create({ data: createLogDto })
  }

  async archiveLogs(logIds: string[]) {
    await this.prismaService.log.updateMany({
      where: {
        id: {
          in: logIds,
        },
      },
      data: {
        archived: true,
        archivedAt: new Date(),
      },
    })

    return {
      status: 'success',
      message: 'Logs archived successfully',
    }
  }

  @Cron('* * 0 * * *')
  async clearAchivedLogs() {
    const logExpirationThreshold = new Date()
    logExpirationThreshold.setDate(
      logExpirationThreshold.getDate() - ARCHIVED_LOG_EXPIRATION_DATE,
    )

    await this.prismaService.log.deleteMany({
      where: {
        archivedAt: {
          lte: logExpirationThreshold,
        },
      },
    })
  }

  async getFileLogs(params: LogParams) {
    return this.winstonLoggerService.getFileLogs(params)
  }

  async getLogs({
    logType,
    timeUnit,
    timeFrame,
    startDate = new Date(),
    endDate,
  }: LogParams) {
    const queryConditions: any = {}

    if (timeUnit && timeFrame) {
      const [initialDate, finalDate] = calculateTimeFrame({
        startDate,
        timeFrame,
        timeUnit,
      })
      queryConditions.timestamp = {
        gte: initialDate,
        lte: finalDate,
      }
    }
    if (startDate && endDate)
      queryConditions.timestamp = {
        gte: startDate,
        lte: endDate,
      }

    if (logType) queryConditions.logType = logType

    const logs = await this.prismaService.log.findMany({
      where: queryConditions,
      orderBy: {
        timestamp: 'desc',
      },
    })

    return {
      status: 'success',
      message: 'Logs fetched successfully',
      data: logs,
    }
  }
}
