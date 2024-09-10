import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsDateString } from 'class-validator'
import { SEX } from 'src/common/util/types/base.type'

export default class AddProfileDto {
  @ApiPropertyOptional({
    description: 'Birth Date',
    example: new Date(),
  })
  @IsDateString()
  @IsOptional()
  birthDate: Date

  @ApiPropertyOptional({
    description: 'Sex of the user',
    example: 'Male',
  })
  @IsString()
  @IsOptional()
  sex: SEX

  @ApiPropertyOptional({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string

  @ApiPropertyOptional({
    description: 'Country of the user',
    example: 'United States',
  })
  @IsString()
  @IsOptional()
  country: string

  @ApiPropertyOptional({
    description: 'City of the user',
    example: 'New York',
  })
  @IsString()
  @IsOptional()
  city: string

  @ApiProperty({
    description: 'Street address of the user',
    example: '123 Main St',
    required: false,
  })
  @IsString()
  @IsOptional()
  streetAddress?: string

  @ApiPropertyOptional({
    description: 'Specific location of the user',
    example: 'Apartment 4B',
    required: false,
  })
  @IsString()
  @IsOptional()
  specificLocation?: string
}
