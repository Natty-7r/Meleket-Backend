import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsString, IsNotEmpty, IsArray, ValidateNested } from 'class-validator'
import UpdateBusinessServiceDto from './update-business-service'

export default class UpdateBusinessServicesDto {
  @ApiProperty({
    description: 'List of services to be updated',
    type: [UpdateBusinessServiceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateBusinessServiceDto)
  services: UpdateBusinessServiceDto[]

  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string
}
