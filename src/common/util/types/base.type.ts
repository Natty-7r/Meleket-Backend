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
    expiresIn: any
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
}

export enum SEX {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}
