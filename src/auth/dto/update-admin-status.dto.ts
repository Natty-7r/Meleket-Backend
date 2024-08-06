import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { AdminStatus } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class UpdateAdminStatusDto {
  @ApiProperty({
    type: String,
    example: 'aasadf4jaasdfasdfjasdf',
    description: 'admin id',
  })
  @IsString()
  @IsNotEmpty()
  id: string

  @ApiProperty({
    type: String,
    example: 'INACTIVE',
    description: 'status',
  })
  @IsString()
  @IsNotEmpty()
  status: AdminStatus

  @ApiPropertyOptional({
    type: String,
    example: 'banned',
    description: 'reason for deactivation',
  })
  @IsString()
  @IsOptional()
  reason: string
}
