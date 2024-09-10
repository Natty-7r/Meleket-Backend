import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator'
import { SEX } from 'src/common/util/types/base.type'

export default class AddProfileDto {
  @ApiPropertyOptional({
    description: 'Birth Date',
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date

  @ApiPropertyOptional({
    description: 'Sex of the user',
    example: 'Male',
  })
  @IsString()
  @IsNotEmpty()
  sex: SEX

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string
}
