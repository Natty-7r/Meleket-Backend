import { ApiProperty } from '@nestjs/swagger'
import RoleResponse from './role.response'

export default class PermissionResponse {
  @ApiProperty({
    description: 'Unique identifier for the permission',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  id: string

  @ApiProperty({
    description: 'Name of the module the permission belongs to',
    example: 'User Management',
  })
  moduleName: string

  @ApiProperty({
    description: 'Type of permission (e.g., CREATE, READ, UPDATE, DELETE)',
    example: 'CREATE',
  })
  permissionName: string

  @ApiProperty({
    description: 'Weight of the permission used for prioritization or sorting',
    example: 10,
  })
  permissionWeight: number

  @ApiProperty({
    description: 'List of roles associated with this permission',
    type: [RoleResponse],
  })
  Roles: RoleResponse[]

  @ApiProperty({
    description: 'Timestamp when the permission was created',
    example: '2024-08-22T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp when the permission was last updated',
    example: '2024-08-22T12:00:00Z',
  })
  updatedAt: Date
}
