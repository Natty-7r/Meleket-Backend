import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsDate, IsDateString } from 'class-validator'
import { SEX } from 'src/common/util/types/base.type'

export default class UpdateProfileDto {
  @ApiPropertyOptional({
    description: 'Birth Date',
    example: new Date(),
  })
  @IsOptional()
  @IsDateString()
  birthDate?: Date

  @ApiPropertyOptional({
    description: 'Sex of the user',
    example: 'Male',
  })
  @IsOptional()
  @IsString()
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
