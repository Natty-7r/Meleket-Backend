import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import CreateOTPDto from './create-otp.dto'

export default class VerifyOTPDto extends CreateOTPDto {
  @ApiProperty({
    type: String,
    example: '098647',
    description: 'otp code send via email or password',
  })
  @IsString()
  @IsNotEmpty()
  otp: string
}
