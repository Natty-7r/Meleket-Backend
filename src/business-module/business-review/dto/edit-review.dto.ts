import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export default class EditReviewDto {
  @ApiProperty({
    description: 'Review content',
    example: 'Great service and friendly staff!',
  })
  @IsString()
  @IsNotEmpty()
  review: string
}
