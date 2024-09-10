import { ApiResponseProperty } from '@nestjs/swagger'

export default class BusinessDetailResponse {
  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  id: string

  @ApiResponseProperty({ example: 'user_uuid' })
  userId: string

  @ApiResponseProperty({ example: 'category_uuid' })
  categoryId: string

  @ApiResponseProperty({ example: "John's Barber Shop" })
  name: string

  @ApiResponseProperty({ example: 'A top-notch barbershop in downtown' })
  description: string

  @ApiResponseProperty({ example: 'template_uuid' })
  templateId: string

  @ApiResponseProperty({ example: 'http://example.com/image.jpg' })
  mainImage: string

  @ApiResponseProperty({
    type: [String],
    example: ['service_uuid2'],
  })
  services: string[]

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  address: string[]

  @ApiResponseProperty({ example: 'business_contact_uuid' })
  businessContact: string

  @ApiResponseProperty({
    type: [String],
    example: ['user_uuid1', 'user_uuid2'],
  })
  followers: string[]

  @ApiResponseProperty({ example: 'CREATED' })
  visibility: string

  @ApiResponseProperty({ example: 'category_uuid' })
  category: string

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  packages: string[]

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  reviews: string[]

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  ratings: string[]

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  bills: string[]

  @ApiResponseProperty({
    type: [String],
    example: [],
  })
  stories: string[]

  @ApiResponseProperty({ example: '2024-08-22T12:34:56.789Z' })
  createdAt: Date

  @ApiResponseProperty({ example: '2024-08-22T12:34:56.789Z' })
  updatedAt: Date
}
