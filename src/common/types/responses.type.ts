import { User } from '@prisma/client'
import { BusinessSubEntity, LogType } from './base.type'

export type ExceptionResponse = {
  message: string
  property: string
}

export type BareApiResponse = {
  status: 'success' | 'fail'
  message: string
}

export type PaginationResoponse = {
  firstPage: number
  lastPage: number
  currentPage: number
  previousPage: number | null
  nextPage: number | null

  totalPages: number
  itemsPerPage: number
  isLastPage: boolean
}

export type ApiResponse<T = any> = BareApiResponse & {
  data: T
}
export type ApiResponseWithPagination<T = any> = BareApiResponse & {
  data: {
    pagination: PaginationResoponse
    payload: T
  }
}

export type LogFileData = {
  logType: LogType
  fileName: string
  fullPath: string
  date: Date
}

export type VerifyOwnershipResponse = {
  entity: BusinessSubEntity
  isBussiness: boolean // is the entity business it self
  user: User
}
