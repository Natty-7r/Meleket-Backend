import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

export default class CreateStoryDto {
  @ApiPropertyOptional({
    description: 'Images for the category',
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  // @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'object') return value
    return [value]
    // if (va) return [parseInt(value, 10)]
    // return value.map((v) => parseInt(v, 10))
    return []
  })
  images?: Express.Multer.File[]

  @ApiPropertyOptional({
    description: 'index where the text will be shown',
    required: false,
    example: [1],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [parseInt(value, 10)]
    return value.map((v) => parseInt(v, 10))
  })
  textViewOrder?: number[]

  @ApiProperty({
    description: 'Text content of the story',
    example: 'This is a sample story text.',
    required: true,
  })
  @IsString()
  @IsOptional()
  text?: string
}
