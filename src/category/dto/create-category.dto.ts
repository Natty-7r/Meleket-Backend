import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'Barber',
    description: 'Business name',
  })
  @IsString()
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

  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'url',
    description: 'image for the category',
  })
  @IsString()
  image: string
}

export class CreateCategoryFinalDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsString()
  parentId: string

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  level: number

  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number

  @IsString()
  image: string

  @IsBoolean()
  verified:boolean
}
