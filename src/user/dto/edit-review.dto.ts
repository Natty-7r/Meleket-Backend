import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export default class EditReviewDto {
  @ApiProperty({
    description: 'Unique identifier for the review being edited ',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    description: 'Review content',
    example: 'Great service and friendly staff!',
  })
  @IsString()
  @IsNotEmpty()
  review: string
}
