import { ApiProperty } from '@nestjs/swagger'

export default class StoryResponse {
  @ApiProperty({
    description: 'Unique identifier for the business service',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string

  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  businessId: string

  @ApiProperty({
    example: 'https://example.com/image.jpg',
  })
  image?: string

  @ApiProperty({
    description: 'Optional image URL for the story',
  })
  text?: any

  @ApiProperty({
    description: 'Timestamp of when the business service was created',
    example: '2024-08-22T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp of when the business service was last updated',
    example: '2024-08-22T12:00:00Z',
  })
  updatedAt: Date
}
