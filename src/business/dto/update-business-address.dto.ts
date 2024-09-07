import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

export default class UpdateBusinessAddressDto {
  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  addressId: string

  @ApiProperty({
    description: 'Country ',
    example: 'Ethiopia',
    required: true,
  })
  @IsString()
  @IsOptional()
  country?: string

  @ApiProperty({
    description: 'City ',
    example: 'Addis Ababa',
    required: true,
  })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({
    description: 'State',
    example: 'Addis Ababa',
    required: true,
  })
  @IsString()
  @IsOptional()
  state?: string

  @ApiPropertyOptional({
    description: 'Street Address',
    example: 'street address',
  })
  @IsString()
  @IsOptional()
  streetAddress?: string

  @ApiPropertyOptional({
    description: 'Specific location',
    example: 'street address',
    required: true,
  })
  @IsString()
  @IsOptional()
  specificLocation?: string
}
