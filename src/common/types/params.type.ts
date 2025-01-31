// business.service.params.ts

import { Category, OTPType, User } from '@prisma/client'
import {
  BusinessSubModel,
  LogType,
  PaginationOptions,
  SelectionOptions,
  Selector,
  TimeUnit,
} from './base.type'

export type SendSMSParams = {
  smsAddress: string
  smsBody: string
  subject: string
}

export type SendEmailParams = {
  address: string
  subject: string
  body: string
}

export type SendMessageParams = {
  address: string
  subject: string
  body: string
}
export type SendOTPParams = {
  address: string
  firstName: string
  otp: string
  otpType: OTPType
}
export type SendAccountCreationParams = {
  address: string
  firstName: string
  password: string
}

/// helper types

export type BaseNameParams = {
  name: string
}
export type PackageIdParams = {
  packageId: string
}

export type UserIdParams = {
  userId: string
}
export type AdminIdParams = {
  adminId: string
}
export type OptionalUserIdParams = {
  userId?: string
}

export type BusinessIdParams = {
  businessId: string
}
export type CategoryIdParams = {
  categoryId: string
}
export type OptionalImageUrlParams = {
  imageUrl?: string
}

export type ImageUrlParams = {
  imageUrl: string
}

export type BaseIdParams = {
  id: string
}
export type BaseBusinessIdParams = {
  businessId: string
}

export type BaseUserIdParams = { userId: string }

export type BaseIdListParams = { ids: string[] }

export type OptionalAdminIdParams = { id?: string }

export type BaseAdminIdParams = { adminId: string }

export type OptionalBaseIdParams = { adminId?: string }

export type BaseRoleIdParams = { roleId: string }

export type BaseOptionalRoleIdParams = { roleId?: string }

export type StoryIdParams = {
  storyId: string
}

/** *
 *
 * Business related params
 */

// Private Methods Types

export type VerifyBusinessIdParams = {
  id: string
}

export type CheckOwnerParams = {
  userId: string
  businessId: string
}

export type CheckBusinessNameParams = {
  name: string
}

export type CheckBusinessAddressParams = {
  businessId: string
  country: string
  state: string
  city: string
  streetAddress?: string
  specificLocation?: string
}

export type CheckBusinessServiceNameParams = {
  businessId: string
  name: string
}

export type VerifyBusinessServiceIdParams = {
  id: string
}

export type VerifyBusinessAddressIdParams = {
  id: string
}

export type CreateBusinessParams = {
  userId: string
  mainImage?: string
}

export type UpdateBusinessServiceImageParams = {
  id: string
  imageUrl: string
  userId: string
}

export type DeleteBusinessServicesParams = {
  id: string
  userId: string
}

export type DeleteBusinessAddressParams = {
  id: string
  userId: string
}

// fetch related types

export type GetBusinessDetailParams = {
  id: string
}

export type GetUserBusinessDetailParams = {
  businessId: string
  userId: string
}

export type GetCategoryBusinessParams = {
  categoryId: string
}

export type SearchBusinessByAddressParams = {
  address: string
}

/**
 *
 * Category related params
 */

export type BaseImageParams = { image: string }
export type GenerateCategoryTreeParams = {
  categories: Category[]
}

/**
 * File relted
 */

export type BaseFilePathParams = {
  filePath: string
}
export type BaseFolderPathParams = {
  folderPath: string
}

/**
 * Validation params
 */

/**
 * Pagination params
 */
export type SortType = 'asc' | 'desc'

export type PaginationParams = {
  page?: number
  items?: number // items per page
  sort?: string[] // sort by
  sortType?: SortType
}

export type CreatePaginatioParams = {
  totalCount: number
  page: number
  items: number
}

/**
 * Sort related
 */

export type APIMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface ApiCallBody {
  [key: string]: any
}

export type APICallParams = {
  url: string
  method: APIMethods
  authToken: string
  body?: ApiCallBody
}

export type RandomStringOptions = {
  length?: number
  lowercase?: boolean
}

export type ChapaInitOptionParams = {
  user: User
  amount: number
  callbackUrl: string
}
export type StripeInitOptionParams = {
  amount: number
  productName: string
  callbackUrl: string
}

export type TimeFrameParams = {
  timeUnit: TimeUnit
  timeFrame: number
  startDate?: Date
}

export type LogFileFormatterParams = {
  logType: LogType
  fileNames: string[]
}

/** Acccess contorl related  */

export type BaseSelectorParams = { selector: Selector } // to pass query condition

export type CheckRoleNameParams = BaseNameParams & {
  forUpdate?: {
    roleId: string
  }
}

export type VerifyOwnershipParams = {
  model: BusinessSubModel
} & BaseUserIdParams &
  BaseIdParams

export type PaginatorParams<T> = {
  model: any
  pageOptions: PaginationOptions
  selectionOption?: SelectionOptions<T>
}
