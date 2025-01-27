import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty, IsJSON } from 'class-validator'

export default class CreateBusinessServiceDto {
  @ApiProperty({
    description: 'image for the category',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  image?: Express.Multer.File

  @ApiProperty({
    description: 'Name for the business service',
    example: 'house cleaning',
  })
  @IsString()
  @IsOptional()
  name: string

  @ApiProperty({
    description: 'Description of the business service',
    example:
      'A comprehensive cleaning service that includes dusting, vacuuming, and more.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty({
    description: 'Specifications of the business service in JSON format',
    example: '{"duration": "2 hours", "price": "50"}',
  })
  @IsJSON()
  @IsNotEmpty()
  specifications: JSON
}
