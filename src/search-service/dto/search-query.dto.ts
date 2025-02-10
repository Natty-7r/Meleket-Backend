import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class SearchQueryDto {
  @ApiProperty({
    type: String,
    example: 'name',
    description: 'query string',
    required: true,
    default: 'barber',
  })
  @IsString()
  @IsNotEmpty()
  query: string
}
