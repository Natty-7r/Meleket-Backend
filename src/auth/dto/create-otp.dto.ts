import { ApiProperty } from '@nestjs/swagger'
import { ChannelType, OTPType, UserType } from '@prisma/client'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsIn,
  ValidateIf,
  IsPhoneNumber,
} from 'class-validator'

export default class CreateOTPDto {
  @ApiProperty({
    type: String,
    example: 'CLIENT_USER',
    description: 'user type',
  })
  @IsEmail()
  @IsNotEmpty()
  userType: UserType

  @ApiProperty({
    type: String,
    example: 'EMAIL',
    description: 'channel type email or phone',
  })
  @IsString()
  @IsIn(['EMAIL', 'PHONE'])
  channelType: ChannelType

  @ApiProperty({
    type: String,
    example: 'abbebe@gmail.com',
    description: 'email values used for otp , if channel is email',
  })
  @IsEmail()
  @IsNotEmpty()
  @ValidateIf((o) => o.channel === 'EMAIL')
  email: string

  @ApiProperty({
    type: String,
    example: '+251975101171',
    description: 'phone values used for otp , if channel is phone',
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  @ValidateIf((o) => o.channel === 'PHONE')
  phone: string

  @ApiProperty({
    type: String,
    example: 'RESET',
    description: 'otp type ',
  })
  @IsString()
  type: OTPType
}
