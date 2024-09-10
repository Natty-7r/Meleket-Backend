import { ApiProperty } from '@nestjs/swagger'

export default class BusinessServicerResponse {
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
    description: 'Name of the business service',
    example: 'Premium Cleaning Service',
  })
  name: string

  @ApiProperty({
    description: 'Description of the business service',
    example:
      'A comprehensive cleaning service that includes dusting, vacuuming, and more.',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'URL or path to the image representing the business service',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  image?: string

  @ApiProperty({
    description: 'Specifications of the business service in JSON format',
    example: '{"duration": "2 hours", "price": "50"}',
  })
  specifications: any

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
