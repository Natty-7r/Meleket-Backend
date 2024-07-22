import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common'
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import { v4 as uuid } from 'uuid'
import ErrorLoggerStrategry from 'src/logger/winston-logger/strategies/error-logger.strategry'
import CustomeException from '../util/exception/custome-exception'
import { ExceptionResponse } from '../util/types'
import parseStackTrace from '../util/helpers/stack-trace-parser'
import { Request, Response } from 'express'

@Catch(CustomeException)
export default class ErrorExceptionFilter implements ExceptionFilter {
  constructor(private logger: WinstonLoggerService) {
    this.logger.configure(new ErrorLoggerStrategry())
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const { message: messageResponse, property } =
      exception.getResponse() as ExceptionResponse

    let stackInfo: any
    if (exception instanceof Error) {
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

    const loggerResponse = {
      id: uuid(),
      status: statusCode,
      path: request.url,
      method: request.method,
      ip: request.ip,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : '',
    }
    this.logger.error(
      typeof message !== 'string' ? (message as any).message : message,
      {
        ...stackInfo,
        ...loggerResponse,
      },
    )
    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: messageResponse,
      property,
    })
  }
}
