import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString, IsUUID } from 'class-validator'
import QueryDto from 'src/common/dto/query.dto'

export default class BusinessQueryDto extends QueryDto {
  @ApiProperty({
    type: String,
    example: 'barber',
    description: 'search by name of category',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string

  @ApiProperty({
    type: String,
    example: 'parent-id-uuid',
    description: 'The parent ID for hierarchical filtering',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  parentId?: string
}
