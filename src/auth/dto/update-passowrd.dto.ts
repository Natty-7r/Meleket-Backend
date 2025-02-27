import { ApiProperty } from '@nestjs/swagger'
import { UserType } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export default class UpdatePasswordDto {
  @ApiProperty({
    enum: UserType,
    example: UserType.CLIENT_USER,
    description: 'user type',
  })
  @IsString()
  @IsNotEmpty()
  userType: UserType

  @ApiProperty({
    type: String,
    example: 'example@gmail.com',
    description: 'user email ',
  })
  @IsNotEmpty()
  email: string

  @ApiProperty({
    type: String,
    example: 'somepassword',
    description: 'new password value',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
