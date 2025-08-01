import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty, IsJSON } from 'class-validator'

export default class UpdateBusinessServiceDto {
  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiPropertyOptional({
    description: 'Name for the business service',
    example: 'house cleaning',
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    description: 'Description of the business service',
    example:
      'A comprehensive cleaning service that includes dusting, vacuuming, and more.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'Specifications of the business service in JSON format',
    example: '{"duration": "2 hours", "price": "50"}',
  })
  @IsJSON()
  @IsNotEmpty()
  specifications?: JSON
}
