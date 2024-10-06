import { ApiProperty } from '@nestjs/swagger'

export default class BusinessPackageResponse {
  @ApiProperty({
    description: 'Unique identifier for the business package',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string

  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  businessId: string

  @ApiProperty({
    description: 'Start date of the business package',
    example: '2024-08-22T12:00:00Z',
  })
  startDate: Date

  @ApiProperty({
    description: 'End date of the business package',
    example: '2025-08-22T12:00:00Z',
  })
  endDate: Date

  @ApiProperty({
    description: 'Indicates whether the package is expired',
    example: false,
  })
  expired: boolean

  @ApiProperty({
    description: 'Indicates whether the package has been billed',
    example: false,
  })
  billed: boolean

  @ApiProperty({
    description: 'Reference for the business package',
    example: 'REF-123456',
  })
  reference: string

  @ApiProperty({
    description: 'Unique identifier for the bill associated with the package',
    example: '550e8400-e29b-41d4-a716-446655440002',
    required: false,
  })
  billId?: string

  @ApiProperty({
    description: 'Timestamp of when the business package was created',
    example: '2024-08-22T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp of when the business package was last updated',
    example: '2024-08-22T12:00:00Z',
  })
  updatedAt: Date
}
