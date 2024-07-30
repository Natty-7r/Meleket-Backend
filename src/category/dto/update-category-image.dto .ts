import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class UpdateCategoryImageDto {
  @ApiProperty({
    type: String,
    example: 'id',
    description: 'Category Id',
  })
  @IsString()
  @IsNotEmpty()
  id: string
}
