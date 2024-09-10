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
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import ActivityLoggerStrategry from 'src/logger/winston-logger/strategies/activity-logger.strategry'

interface IActivity {
  id: string
  method: string
  url: string
  status: number
  timestamp: string
  res: any
}

@Injectable()
export default class ActivityInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {
    this.logger.configure(new ActivityLoggerStrategry())
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()

    const activityLog: IActivity = {
      id: uuidv4(),
      method: request.method,
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
            request.originalUrl.includes('/winston') ||
            request.originalUrl === '/'
          )
        ) {
          this.logger.log('', { ...activityLog })
        }
      }),
    )
  }
}
