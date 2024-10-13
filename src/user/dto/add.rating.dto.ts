import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber } from 'class-validator'

export default class AddRatingDto {
  @ApiProperty({
    description: 'Unique identifier for the business being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({
    description: 'Rating value',
    example: '5',
  })
  @IsNumber()
  @IsNotEmpty()
  rateValue: number
}
