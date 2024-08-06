import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export default class UpdatePasswordDto {
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
    example: '234879028349012834802-3',
    description: 'user id ',
  })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    type: String,
    example: 'somepassword',
    description: 'new password value',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
