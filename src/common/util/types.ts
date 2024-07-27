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

export interface RequestWithUser extends Request {
  user: User
}

export type MulterStorageConfig = {
  folder: string
  filePrefix: string
}

export type FileType = 'image' | 'pdf' | 'txt' | 'doc'

export type MulterFilterConfig = {
  fileType: FileType
  maxSize: number // in MB
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

// id       String  @id @default(uuid())
// name     String  @db.VarChar(255)
// parentId String?
// level    Int
// price    Float
// image    String
// verified Boolean @default(false)

// createdAt DateTime @default(now())
// updatedAt DateTime @updatedAt

// parent   Category?  @relation("CategoryToCategory", fields: [parentId], references: [id])
// children Category[] @relation("CategoryToCategory")
// business Business[]
