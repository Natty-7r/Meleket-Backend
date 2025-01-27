import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator'
import QueryDto from 'src/common/dto/query.dto'
import { BusinessSortableFields } from 'src/common/types/base.type'

export default class BusinessQueryDto extends QueryDto {
  @ApiPropertyOptional({
    type: String,
    example: 'barber',
    description: 'search by name of category',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string

  @ApiPropertyOptional({
    type: String,
    example: 'uuid',
    description: 'Category id',
    required: false,
  })
  @IsString()
  @IsOptional()
  categoryId?: string

  @ApiPropertyOptional({
    type: String,
    example: 'uuid',
    description: 'User id ',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string

  @ApiPropertyOptional({
    description: 'Field to order by from Business sortables fields',
    example: 'rating',
    enum: BusinessSortableFields,
  })
  @IsOptional()
  @IsEnum(BusinessSortableFields)
  orderOption?: BusinessSortableFields

  @ApiPropertyOptional({
    description: 'Order direction (ascending or descending)',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderType?: 'asc' | 'desc'
}
