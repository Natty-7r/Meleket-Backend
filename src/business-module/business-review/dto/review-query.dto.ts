import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsOptional } from 'class-validator'
import QueryDto from 'src/common/dto/query.dto'
import { ReviewSortableFields } from 'src/common/types/base.type'

export default class ReviewQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Field to order by from Review sortables fields',
    example: 'rating',
    enum: ReviewSortableFields,
  })
  @IsOptional()
  @IsEnum(ReviewSortableFields)
  orderOption?: ReviewSortableFields

  @ApiPropertyOptional({
    description: 'Order direction (ascending or descending)',
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  orderType?: 'asc' | 'desc'
}
