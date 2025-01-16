import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator'

export default class UpdateRoleDto {
  @ApiPropertyOptional({
    description: 'Role name',
    example: 'Admin',
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiPropertyOptional({
    description: 'List of permission IDs associated with the role',
    example: ['550e8400-e29b-41d4-a716-446655440001', 'perm2'],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  permissions?: string[]
}
