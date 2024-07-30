import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export default class UpdateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'id',
    description: 'Category  Id',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    type: String,
    example: 'Barber',
    description: 'Business name',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    type: String,
    example: 'parent_id',
    description: 'Id of parent category',
  })
  @IsOptional()
  @IsString()
  parentId: string

  @ApiProperty({
    type: String,
    example: '1',
    description: 'category level 1 for top parent category',
  })
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  level: number

  @ApiPropertyOptional({
    type: String,
    example: '100',
    description: 'Business category price in birr',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number

  @ApiPropertyOptional({
    type: Boolean,
    example: true,
    description: 'to verify user created account',
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Boolean(value))
  verified: boolean
}
