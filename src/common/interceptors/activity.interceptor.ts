import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map, tap } from 'rxjs/operators'
import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import LoggerService from 'src/logger/logger.service'
import { ActivityLogData } from '../types/base.type'

@Injectable()
export default class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    const activityLog: ActivityLogData = {
      id: uuidv4(),
      method: request.method,
      ip: request.ip,
      url: request.originalUrl,
      status: response.statusCode,
      timestamp: new Date().toISOString(),
      res: {},
    }

    return next.handle().pipe(
      map((data) => {
        activityLog.res = data
        return data
      }),
      tap(() => {
        if (
          !(
            request.originalUrl.includes('/logs') || request.originalUrl === '/'
          )
        ) {
          this.loggerService.log('', { ...activityLog })
        }
      }),
    )
  }
}
