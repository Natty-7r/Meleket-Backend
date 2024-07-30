import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export default class UpdateParentCategoryDto {
  @ApiProperty({
    type: String,
    example: 'id',
    description: 'Destination parent id',
  })
  @IsString()
  @IsNotEmpty()
  parentId: string

  @ApiProperty({
    type: String,
    example: ['id1', 'id2', 'id3'],
    description: 'list of children category ids',
  })
  @IsNotEmpty()
  @IsString()
  childrenId: string[]
}
