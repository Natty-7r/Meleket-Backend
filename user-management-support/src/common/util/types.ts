import { Request } from 'express'
import { User } from '@prisma/client'

export type ExceptionResponse = {
  message: string
  property: string
}

export type Module = {
  id: number
  name: string
}

export enum LoggerType {
  ACTIVITY = 'ACTIVITY',
  ERROR = 'ERROR',
}
export type LoggerOption = {
  level: string
  dirname?: string
  filename: string
}

export type StackTraceInfo = {
  fileName: string
  row: string
  errorType: string
  col: string
}

export interface FunctionCallResponse {
  status: 'fail' | 'success'
  data: any
}

export type RequestWithUser = User & Request
