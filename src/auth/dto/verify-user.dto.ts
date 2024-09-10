import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class VerifyAccountDto {
  @ApiProperty({
    type: String,
    example: 'abbebe@gmail.com',
    description: 'email values used for otp , if channel is email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    type: String,
    example: '098647',
    description: 'otp code send via email or password',
  })
  @IsString()
  @IsNotEmpty()
  otp: string
}
