import { ApiProperty } from '@nestjs/swagger'

export default class RoleResponse {
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string

  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  roleName: string

  @ApiProperty({
    description: 'Type of role',
    example: 'ADMIN',
  })
  roleType: string

  @ApiProperty({
    description: 'Unique identifier for the creator of the role',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  creatorId?: string

  @ApiProperty({
    description: 'Unique identifier for the company associated with the role',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  companyId: string

  @ApiProperty({
    description: 'Timestamp of when the role was created',
    example: '2024-08-22T12:00:00Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp of when the role was last updated',
    example: '2024-08-22T12:00:00Z',
  })
  updatedAt: Date
}
