import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class CreateAccountDto {
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

  @ApiPropertyOptional({
    type: String,
    example: '12345',
    description: 'User password',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
