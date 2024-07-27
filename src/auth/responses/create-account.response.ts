import { ApiResponseProperty } from '@nestjs/swagger'

export default class CreateAccountResponse {
  @ApiResponseProperty({
    type: String,
    example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac',
  })
  id: string

  @ApiResponseProperty({
    type: String,
    example: 'abebe',
  })
  firstName: string

  @ApiResponseProperty({
    type: String,
    example: 'kebede',
  })
  lastName: string

  @ApiResponseProperty({
    type: String,
    example: 'FIRST',
  })
  profileLevel: string

  @ApiResponseProperty({ type: String, example: 'CLIENT_USER' })
  userType: string

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  createdAt: Date

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  passwordUpdatedAt: Date
}
