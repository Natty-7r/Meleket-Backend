import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import { v4 as uuid } from 'uuid'
import ErrorLoggerStrategry from 'src/logger/winston-logger/strategies/error-logger.strategry'
import { Request, Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import ActivityLoggerStrategry from 'src/logger/winston-logger/strategies/activity-logger.strategry'
import { ErrorLogData, StackTraceInfo } from '../util/types/base.type'
import { parseStackTrace } from '../util/helpers/parser.helper'

@Catch()
export default class ErrorExceptionFilter implements ExceptionFilter {
  errorLoggerStrategry: ErrorLoggerStrategry

  activityLoggerStrategry: ActivityLoggerStrategry

  constructor(private logger: WinstonLoggerService) {
    this.errorLoggerStrategry = new ErrorLoggerStrategry()
    this.activityLoggerStrategry = new ActivityLoggerStrategry()
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const messageResponse = exception.message
    const { property } = exception
    let stackInfo: StackTraceInfo

    if (exception instanceof Error) {
      stackInfo = parseStackTrace(exception.stack)
    }
    if (exception instanceof PrismaClientKnownRequestError) {
      stackInfo = parseStackTrace(exception.stack)
    }

    const { message, statusCode } =
      exception instanceof HttpException
        ? {
            message: exception.getResponse(),
            statusCode: exception.getStatus(),
          }
        : {
            message: 'Internal Server Error',
            statusCode: 500,
          }

    const loggerResponse: ErrorLogData = {
      id: uuid(),
      status: statusCode,
      url: request.url,
      method: request.method,
      ip: request.ip,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : '',
    }
    if (statusCode >= 400 && statusCode < 500) {
      // take user error as activity

      this.logger.configure(this.activityLoggerStrategry)
      this.logger.log(
        typeof message !== 'string' ? (message as any).message : message,
        { ...loggerResponse },
      )
    } else {
      this.logger.configure(this.errorLoggerStrategry)
      this.logger.error(
        typeof message !== 'string' ? (message as any).message : message,
        { ...loggerResponse, ...stackInfo },
      )
    }
    response.status(statusCode).json({
      statusCode,
      message: messageResponse,
      property,
    })
  }
}
