import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class SignInDto {
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
