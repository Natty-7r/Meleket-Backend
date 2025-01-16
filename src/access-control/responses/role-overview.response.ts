import { ApiProperty } from '@nestjs/swagger'
import { RoleType } from '@prisma/client'

export default class RoleOverviewResponse {
  @ApiProperty({
    description: 'Unique identifier for the role',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string

  @ApiProperty({
    description: 'Type of the role',
    example: RoleType.ADMIN,
  })
  roleType: RoleType

  @ApiProperty({
    description: 'Name of the role',
    example: 'Admin',
  })
  roleName: string

  @ApiProperty({
    description: 'Unique identifier for the company associated with the role',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  companyId: string
}
