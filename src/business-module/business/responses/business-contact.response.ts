import { ApiResponseProperty } from '@nestjs/swagger'

export default class BusinessContactResponse {
  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  id: string

  @ApiResponseProperty({ example: 'business_uuid' })
  businessId: string

  @ApiResponseProperty({ example: '+1234567890' })
  phone?: string

  @ApiResponseProperty({ example: 'contact@example.com' })
  email?: string

  @ApiResponseProperty({ example: 'https://facebook.com/business' })
  facebook?: string

  @ApiResponseProperty({ example: 'https://instagram.com/business' })
  instagram?: string

  @ApiResponseProperty({ example: 'https://t.me/business' })
  telegram?: string

  @ApiResponseProperty({ example: 'https://github.com/business' })
  github?: string

  @ApiResponseProperty({ example: 'https://linkedin.com/in/business' })
  linkedIn?: string

  @ApiResponseProperty({ example: '2024-08-22T12:34:56.789Z' })
  createdAt: Date

  @ApiResponseProperty({ example: '2024-08-22T12:34:56.789Z' })
  updatedAt: Date
}
