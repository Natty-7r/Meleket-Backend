import { ApiResponseProperty } from '@nestjs/swagger'

export default class CreateCategoryResponse {
  @ApiResponseProperty({
    type: String,
    example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac',
  })
  id: string

  @ApiResponseProperty({
    type: String,
    example: 'pharmacy',
  })
  name: string

  @ApiResponseProperty({
    type: String,
    example: '8ada29bb-5c51-4dd9-9819-4fb5175dd5ac',
  })
  parentId?: string

  @ApiResponseProperty({
    type: Number,
    example: 1,
  })
  level: number

  @ApiResponseProperty({
    type: Number,
    example: 100,
  })
  price: number

  @ApiResponseProperty({
    type: String,
    example: 'uploads/category/category.png',
  })
  image: string

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  createdAt: Date

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  updatedAt: Date
}
