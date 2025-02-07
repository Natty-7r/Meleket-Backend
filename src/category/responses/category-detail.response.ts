import { ApiResponseProperty } from '@nestjs/swagger'
import CategoryTreeResponse from './category-tree.response'

export default class CategoryDetailResponse {
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

  @ApiResponseProperty({
    type: Array<CategoryTreeResponse>,
    example: [
      {
        id: '31b513c1-7092-4c1d-a889-5da436d927c1',
        name: 'animal pharmacy',
        parentId: '7b5c9d7f-9050-4a90-8561-954d85fef887',
        image: 'uploads/category/category.png',
        level: 3,
        price: 2,
        children: [],
      },
      {
        id: 'dd9594a6-3737-4977-9a63-028d51e3ce65',
        name: 'human pharmacy',
        parentId: '7b5c9d7f-9050-4a90-8561-954d85fef887',
        image: 'uploads/category/category.png',
        level: 3,
        price: 2,
        children: [],
      },
      {
        id: 'd3a273fd-c7c7-43c1-92d6-71e28c1bbe06',
        name: 'children pharmacy',
        parentId: '7b5c9d7f-9050-4a90-8561-954d85fef887',
        image: 'uploads/category/category.png',
        level: 3,
        price: 2,
        children: [],
      },
    ],
  })
  tree: CategoryTreeResponse

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  createdAt: Date

  @ApiResponseProperty({ type: Date, example: '"2024-07-26T16:30:54.784Z' })
  updatedAt: Date

  @ApiResponseProperty({
    type: Object,
    example: {
      business: 0,
      children: 3,
    },
  })
  _count: {
    business: number
    children: number
  }
}
