import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class SearchBusinessDto {
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
    example: 'A top-notch barbershop in downtown',
    description: 'Description of the business',
  })
  @IsString()
  @IsNotEmpty()
  description: string
}
