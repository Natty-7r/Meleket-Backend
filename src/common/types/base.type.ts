import { Request } from 'express'
import {
  Admin,
  ModuleName,
  PermissionType,
  Role,
  User,
  Business,
  BusinessAddress,
  BusinessContact,
  BusinessPackage,
  BussinessService,
  Story,
  Bill,
  Category,
} from '@prisma/client'
import {
  SUPER_ADMIN_PERMISSION_SELECTOR,
  USER_PERMISSION_SELECTOR,
} from '../constants/access-control.contants'

export type Module = {
  id: number
  name: string
}

export type UserType = 'USER' | 'ADMIN'

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

export type RequestUser = User | Admin

export interface RequestWithUser extends Request {
  user: User | Admin
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
  stripe: {
    secretKey: string
    successUrl: string
    failUrl: string
  }
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
export interface StripeSessionInfo {
  sessionId: string
  url: string
}

export interface StripeCheckoutSessionItem {
  price_data: {
    currency: string
    product_data: {
      name: string
    }
    unit_amount: number
  }
  quantity: number
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

export enum PermissionWeight {
  READ = 1,
  CREATE = 2,
  UPDATE = 3,
  WRITE = 4,
  DELETE = 5,
}

export type Selector =
  | typeof USER_PERMISSION_SELECTOR
  | typeof SUPER_ADMIN_PERMISSION_SELECTOR

export type RoleUserCountInfo = {
  _count: {
    admins: number
    users: number
  }
}
export type RoleWithCountInfo = Role & RoleUserCountInfo

export type PermisionSet = {
  model: ModuleName
  action: PermissionType
}

export type BusinessSubModel =
  | 'BUSINESS'
  | 'BUSINESS_SERVICE'
  | 'BUSINESS_ADDRESS'
  | 'BUSINESS_CONTACT'
  | 'BUSINESS_PACKAGE'
  | 'STORY'
  | 'BILL'

export type BusinessSubEntity =
  | Business
  | BussinessService
  | BusinessAddress
  | BusinessContact
  | BusinessPackage
  | Story
  | Bill

type AnyObject = { [key: string]: any }

export type OrderByOption<T> = {
  [K in keyof T]?: 'asc' | 'desc'
} & AnyObject

export type SelectOption<T> = {
  [K in keyof T]?: boolean
} & { [key: string]: any }
export type IncludesOption<T> = {
  [K in keyof T]?: boolean | IncludesOption<T[K]>
} & AnyObject

export type Condition<T> = {
  [K in keyof T]?: T[K] | Condition<T[K]>
} & { deletedAt?: any } & AnyObject

export type PaginationOptions = {
  page?: number | string
  itemsPerPage?: number | string
}

// export type SelectionOptions<T> = {
//   select?: SelectOption<T>
//   include?: IncludesOption<T>
//   orderBy?: OrderByOption<T>[]
//   condition?: Condition<T>
// }

export type SelectionOptions<T> = {
  select?: any
  include?: any
  orderBy?: any
  condition?: any
}

export interface PaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    itemsPerPage: number

    total: number
    lastPage: number
    prev: number | null
    next: number | null
  }
}

export enum BusinessSortableFields {
  'rating' = 'rating',
  'follower' = 'follower',
  'service' = 'service',
}
export enum ReviewSortableFields {
  'rating' = 'rating',
}

export interface CategoryDetail extends Category {
  children: Category[]
  _count: {
    business: number
  }
}
