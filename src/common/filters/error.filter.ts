import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { Request, Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { ErrorLogData, StackTraceInfo } from '../types/base.type'
import { parseStackTrace } from '../helpers/parser.helper'
import LoggerService from '../../logger/logger.service'

@Catch()
export default class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private loggerService: LoggerService) {}

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

      this.loggerService.log(
        typeof message !== 'string' ? (message as any).message : message,
        { ...loggerResponse },
      )
    } else {
      this.loggerService.error(
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
