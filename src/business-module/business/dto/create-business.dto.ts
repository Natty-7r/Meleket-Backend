import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class CreateBusinessDto {
  @ApiPropertyOptional({
    description: 'image for the category',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: Express.Multer.File

  @ApiProperty({
    type: String,
    example: "John's Barber Shop",
    description: 'Name of the business',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    type: String,
    example: 'category_uuid',
    description: 'ID of the category the business belongs to',
  })
  @IsString()
  @IsNotEmpty()
  categoryId: string

  @ApiProperty({
    type: String,
    example: 'A top-notch barbershop in downtown',
    description: 'Description of the business',
  })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({
    type: String,
    example: 'template_uuid',
    description: 'ID of the template used by the business',
  })
  @IsString()
  @IsNotEmpty()
  templateId: string
}
