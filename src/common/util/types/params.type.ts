// business.service.params.ts

import { Category, OTPType } from '@prisma/client'

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

export type UserIdParams = {
  userId: string
}

export type BusinessIdParams = {
  businessId: string
}
export type CategoryIdParams = {
  categoryId: string
}
export type ImageUrlParams = {
  imageUrl?: string
}
export type OptionalImageUrlParams = {
  imageUrl?: string
}
export type BaseIdParams = {
  id: string
}

/***
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

export type UpdateBusinessImageParams = {
  id: string
  imageUrl: string
  userId: string
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

export type GetAllBusinessParams = {}

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

export type SearchBusinessParams = {
  searchKey: string
}

export type SearchBusinessByAddressParams = {
  address: string
}

/**
 *
 * Category related params
 */
export type CreateCategoryParams = ImageUrlParams & {
  verified: boolean
}
export type GenerateCategoryTreeParams = ImageUrlParams & {
  categories: Category[]
}
