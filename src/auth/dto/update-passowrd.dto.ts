import { ApiProperty } from '@nestjs/swagger'
import {} from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export default class UpdatePasswordDto {
  @ApiProperty({
    type: String,
    example: 'ADMIN',
    description: 'user type',
  })
  @IsString()
  @IsNotEmpty()
  userType: any

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
