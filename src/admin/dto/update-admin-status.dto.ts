import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Status } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class UpdateAdminStatusDto {
  @ApiProperty({
    type: String,
    example: 'INACTIVE',
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: Status

  @ApiPropertyOptional({
    type: String,
    example: 'banned',
    description: 'reason for deactivation',
  })
  @IsString()
  @IsOptional()
  reason: string
}
