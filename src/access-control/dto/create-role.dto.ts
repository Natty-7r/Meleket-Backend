import { ApiProperty } from '@nestjs/swagger'
import { RoleType } from '@prisma/client'
import { IsString, IsNotEmpty, IsArray, IsUUID, IsEnum } from 'class-validator'

export default class CreateRoleDto {
  @ApiProperty({
    description: 'Role name',
    example: 'Admin',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'Role type',
    example: 'ADMIN',
    required: true,
    enum: RoleType,
  })
  @IsEnum(RoleType)
  @IsNotEmpty()
  roleType: RoleType

  @ApiProperty({
    description: 'List of permission IDs associated with the role',
    example: ['550e8400-e29b-41d4-a716-446655440001'],
    required: true,
  })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsNotEmpty()
  permissions: string[]
}
