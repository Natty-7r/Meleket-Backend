import { ApiResponseProperty } from '@nestjs/swagger'
import { SEX } from 'src/common/types/base.type'

export default class ProfileResponse {
  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  id: string

  @ApiResponseProperty({ example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac' })
  userId: string

  @ApiResponseProperty({ example: new Date() })
  birthDate: Date

  @ApiResponseProperty({ example: 25 })
  age: number

  @ApiResponseProperty({ example: SEX.MALE })
  sex: SEX

  @ApiResponseProperty({ example: '2024-09-08T12:34:56.789Z' })
  createdAt: Date

  @ApiResponseProperty({ example: '2024-09-08T12:34:56.789Z' })
  updatedAt: Date
}
