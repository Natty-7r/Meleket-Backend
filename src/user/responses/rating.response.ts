import { ApiResponseProperty } from '@nestjs/swagger'

export default class RatingResponse {
  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  id: string

  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  userId: string

  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  businessId: string

  @ApiResponseProperty({ example: 5 })
  rateValue: number

  @ApiResponseProperty({ example: '2024-09-08T12:34:56.789Z' })
  createdAt: Date

  @ApiResponseProperty({ example: '2024-09-08T12:34:56.789Z' })
  updatedAt: Date
}
