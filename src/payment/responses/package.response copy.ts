import { ApiProperty } from '@nestjs/swagger'
import BusinessPackageResponse from './business-package.response'

export default class PackageResponse {
  @ApiProperty({
    description: 'Unique identifier for the package',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string

  @ApiProperty({
    description: 'Name of the package',
    example: 'Basic Package',
  })
  name: string

  @ApiProperty({
    description: 'Code associated with the package',
    example: 'BASIC001',
  })
  code: string

  @ApiProperty({
    description: 'Price of the package in birr',
    example: 1000.0,
  })
  price: number

  @ApiProperty({
    description: 'Number of months the package is valid for',
    example: 12,
  })
  monthCount: number

  @ApiProperty({
    description: 'Description of the package',
    example: 'This package includes basic features and support.',
    required: false,
  })
  description?: string

  @ApiProperty({
    description: 'Array of business packages associated with this package',
    type: [BusinessPackageResponse], // Reference the previously defined BusinessPackageResponse class
    required: false,
  })
  businessPackages?: BusinessPackageResponse[]

  @ApiProperty({
    description: 'Timestamp of when the package was created',
    example: '2024-08-22T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp of when the package was last updated',
    example: '2024-08-22T12:00:00Z',
  })
  updatedAt: Date
}
