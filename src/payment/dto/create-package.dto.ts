import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDecimal,
} from 'class-validator'

export default class CreatePackageDto {
  @ApiProperty({
    description: 'name of string',
    example: 'monthly',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    description: 'description',
    example: 'package ends montly',
  })
  @IsString()
  @IsOptional()
  description: string

  @ApiProperty({
    description: 'price in birr ',
    example: '300 ',
  })
  @IsNotEmpty()
  @IsDecimal()
  price: number

  @ApiProperty({
    description: 'number of months it is used for ',
    example: '300 ',
  })
  @IsNotEmpty()
  @IsInt()
  monthCount: number
}
