import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export default class CreateBusinessDto {
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
  @IsUUID()
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
  @IsUUID()
  @IsNotEmpty()
  templateId: string
}
