import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, IsNotEmpty } from 'class-validator'

export default class AssignRoleDto {
  @ApiProperty({
    description: 'Role ID to be assigned',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string
}
