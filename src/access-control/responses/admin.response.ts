import { ApiProperty } from '@nestjs/swagger'
import RoleOverviewResponse from './role-overview.response'

export default class AdminResponse {
  @ApiProperty({
    description: 'Unique identifier for the admin',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  id: string

  @ApiProperty({
    description: 'First name of the admin',
    example: 'Jane',
  })
  firstName: string

  @ApiProperty({
    description: 'Middle name of the admin',
    example: 'Doe',
    required: false,
  })
  middleName?: string

  @ApiProperty({
    description: 'Last name of the admin',
    example: 'Smith',
  })
  lastName: string

  @ApiProperty({
    description: 'Email of the admin',
    example: 'jane.smith@example.com',
  })
  email: string

  @ApiProperty({
    description: 'Status of the admin',
    example: 'ACTIVE',
  })
  status: string

  @ApiProperty({
    description: 'Role information of the admin',
    type: RoleOverviewResponse,
  })
  Role?: RoleOverviewResponse

  @ApiProperty({
    description: 'Company ID associated with the admin',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  companyId?: string
}
