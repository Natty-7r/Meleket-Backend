import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsUUID } from 'class-validator'

export default class UpdateBusinessDto {
  @ApiProperty({
    type: String,
    example: 'alkhjdkhahdlsdhlajlafds',
    description: 'ID of the business',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiPropertyOptional({
    type: String,
    example: "John's Barber Shop",
    description: 'Name of the business',
  })
  @IsString()
  @IsNotEmpty()
  name?: string

  @ApiPropertyOptional({
    type: String,
    example: 'A top-notch barbershop in downtown',
    description: 'Description of the business',
  })
  @IsString()
  @IsNotEmpty()
  description?: string
}
