import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDecimal,
} from 'class-validator'

export default class UpdatePackageDto {
  @ApiProperty({
    description: 'Unique identifier for the package selected ',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiPropertyOptional({
    description: 'name of string',
    example: 'monthly',
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    description: 'description',
    example: 'package ends montly',
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiPropertyOptional({
    description: 'price in birr ',
    example: '300 ',
  })
  @IsOptional()
  @IsDecimal()
  price?: number

  @ApiPropertyOptional({
    description: 'number of months it is used for ',
    example: '300 ',
  })
  @IsOptional()
  @IsInt()
  monthCount?: number
}
