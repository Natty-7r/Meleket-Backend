import { Request } from 'express'
import { Admin, User } from '@prisma/client'

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

export interface FunctionCallResponse {
  status: 'fail' | 'success'
  data: any
}

export type USER = User | Admin

export interface RequestWithUser extends Request {
  user: USER
}

export type MulterStorageConfig = {
  folder: string
  filePrefix: string
}

export type FileType = 'image' | 'pdf' | 'txt' | 'doc'

export type MulterFilterConfig = {
  fileType: FileType
  maxSize: number // in MB
  optional?: boolean
}

export interface CategoryTreeNode {
  id: string
  name: string
  parentId: string | null
  level: number
  price: number
  image: string
  children: CategoryTreeNode[]
}

export type CategoryTreeSwaggerConfig = {
  operationName: string
  successMessage: string
}

export enum SignUpType {
  BY_EMAIL = 'BY_EMAIL',
  OAUTH = 'OAUTH',
}

export interface ChapaConfig {
  secretKey: string // Chapa secret key
  baseUrl: string // Base URL for Chapa API
  initializePath: string // Path for transaction initialization
  verifyPath: string // Path for transaction verification
}

export interface Config {
  server: {
    host: string
    port: number
  }
  db: {
    user: string
    password: string
    name: string
    url: string
  }
  otp: {
    length: number
    expirationMinute: number
  }
  jwt: {
    secret: string
    expiresIn: string | number // More specific type if possible
  }
  google: {
    clientId: string
    clientSecret: string
    redirectUrl: string
  }
  twilio: {
    accountSid: string
    authToken: string
    smsSender: string
  }
  email: {
    host: string
    port: number
    sender: string
    senderPassword: string
  }
  superAdmin: {
    firstName: string
    lastName: string
    email: string
    password: string
  }
  chapa: ChapaConfig
}
export enum SEX {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export interface Options {
  [key: string]: any
}

// chapa related

export interface ChapaCustomerInfo {
  amount: number
  currency: string
  email: string
  /* eslint-disable */
  first_name: string
  last_name: string
  callback_url: string
  tx_ref: string // Optional, will be generated if not provided
  /* eslint-disable */
  customization?: Record<string, any> // Customize based on actual usage
}

export enum TimeUnit {
  h = 'h',
  d = 'd',
  w = 'w',
  m = 'm',
  y = 'y',
}

export enum AuthLogType {
  USER_ACTIVITY = 'USER_ACTIVITY',
  ADMIN_ACTIVITY = 'ADMIN_ACTIVITY',
  SYSTEM_ACTIVITY = 'SYSTEM_ACTIVITY',
}
export enum LogType {
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  ACTIVITY = 'ACTIVITY',
}
export enum LogFileFolder {
  ACTIVITY = 'activities',
  ERROR = 'errors',
}

export type LogData = {
  id: string
  method: string
  ip: string
  url: string
  status: number
  timestamp: string
}
export type StackTraceInfo = {
  fileName?: string
  row?: string
  errorType?: string
  col?: string
}
export type ActivityLogData = LogData & {
  res: any
}
export type ErrorLogData = LogData & {
  stack: any
} & StackTraceInfo

export type LogFile = {
  logType: LogType
  content: string
}
