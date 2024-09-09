import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export default class AddReviewDto {
  @ApiProperty({
    description: 'Unique identifier for the business being reviewed',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({
    description: 'Review content',
    example: 'Great service and friendly staff!',
  })
  @IsString()
  @IsNotEmpty()
  review: string
}
