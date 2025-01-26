import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export default class CreateCategoryDto {
  @ApiProperty({
    description: 'image for the category',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File

  @ApiProperty({
    type: String,
    example: 'Barber',
    description: 'Business name',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiPropertyOptional({
    type: String,
    example: 'parent_id',
    description: 'Id of parent category',
  })
  @IsOptional()
  @IsString()
  parentId?: string

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
  price?: number
}
