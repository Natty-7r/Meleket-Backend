import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export default class UpdateAdminDto {
  @ApiPropertyOptional({
    type: String,
    example: 'abbebe',
    description: 'User first name',
  })
  @IsString()
  @IsOptional()
  firstName: string

  @ApiPropertyOptional({
    type: String,
    example: 'kebede',
    description: 'User last name',
  })
  @IsString()
  @IsOptional()
  lastName: string
}
