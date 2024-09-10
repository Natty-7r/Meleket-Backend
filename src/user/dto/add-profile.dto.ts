import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional, IsNotEmpty, IsDateString } from 'class-validator'
import { SEX } from 'src/common/util/types/base.type'

export default class AddProfileDto {
  @ApiProperty({
    description: 'Birth Date',
    example: new Date(),
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: Date

  @ApiProperty({
    description: 'Sex of the user',
    example: 'Male',
  })
  @IsString()
  @IsNotEmpty()
  sex: SEX

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  profilePicture?: string

  @ApiProperty({
    description: 'Country of the user',
    example: 'United States',
  })
  @IsString()
  @IsNotEmpty()
  country: string

  @ApiProperty({
    description: 'City of the user',
    example: 'New York',
  })
  @IsString()
  @IsNotEmpty()
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
