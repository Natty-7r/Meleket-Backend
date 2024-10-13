import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {} from '@prisma/client'
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class CreateAdminDto {
  @ApiProperty({
    type: String,
    example: 'abbebe',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string

  @ApiProperty({
    type: String,
    example: 'kebede',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string

  @ApiProperty({
    type: String,
    example: 'abbebedebe@gmail.com',
    description: 'User email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    type: String,
    example: '12345',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiPropertyOptional({
    type: String,
    example: 'aasadf4jaasdfasdfjasdf',
    description: 'role id',
  })
  @IsString()
  @IsOptional()
  roleId?: string
}
