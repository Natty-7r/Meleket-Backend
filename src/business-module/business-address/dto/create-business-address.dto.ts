import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export default class CreateBusinessAddressDto {
  @ApiProperty({
    description: 'Country ',
    example: 'Ethiopia',
    required: true,
  })
  @IsString()
  @IsOptional()
  country: string

  @ApiProperty({
    description: 'City ',
    example: 'Addis Ababa',
    required: true,
  })
  @IsString()
  @IsOptional()
  city: string

  @ApiProperty({
    description: 'State',
    example: 'Addis Ababa',
    required: true,
  })
  @IsString()
  @IsOptional()
  state: string

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
