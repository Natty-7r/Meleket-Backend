import { ApiProperty } from '@nestjs/swagger'
import { AuthProvider } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export default class UpdateAuthProviderDto {
  @ApiProperty({
    enum: AuthProvider,
    example: AuthProvider.LOCAL,
    description: 'new auth method',
  })
  @IsEnum(AuthProvider)
  @IsNotEmpty()
  authMethod: AuthProvider

  @ApiProperty({
    type: String,
    example: 'somepassword',
    description: 'new password value',
  })
  @IsString()
  @IsOptional()
  password: string
}
