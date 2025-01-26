import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'

export default class AddReviewDto {
  @ApiProperty({
    description: 'Review content',
    example: 'Great service and friendly staff!',
  })
  @IsString()
  @IsOptional()
  review: string

  @ApiProperty({
    description: 'Rating value',
    example: '5',
  })
  @IsNumber()
  @IsOptional()
  rating?: number
}
