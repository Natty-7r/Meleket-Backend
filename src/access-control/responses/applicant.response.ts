import { ApiProperty } from '@nestjs/swagger'
import RoleOverviewResponse from './role-overview.response'

export default class ApplicantResponse {
  @ApiProperty({
    description: 'Unique identifier for the applicant',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  id: string

  @ApiProperty({
    description: 'First name of the applicant',
    example: 'John',
  })
  firstName: string

  @ApiProperty({
    description: 'Middle name of the applicant',
    example: 'Doe',
    required: false,
  })
  middleName?: string

  @ApiProperty({
    description: 'Last name of the applicant',
    example: 'Smith',
  })
  lastName: string

  @ApiProperty({
    description: 'Email of the applicant',
    example: 'john.doe@example.com',
  })
  email: string

  @ApiProperty({
    description: 'Status of the applicant',
    example: 'ACTIVE',
  })
  status: string

  @ApiProperty({
    description: 'Role information of the applicant',
    type: RoleOverviewResponse,
  })
  Role: RoleOverviewResponse
}
