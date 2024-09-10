import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsOptional, IsString, IsNotEmpty } from 'class-validator'

export default class UpdateBusinessContactDto {
  @ApiProperty({
    description: 'Unique identifier for the business',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiPropertyOptional({
    description: 'Phone number of the business',
    example: '+251911123456',
  })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiPropertyOptional({
    description: 'Email address of the business',
    example: 'contact@business.com',
  })
  @IsString()
  @IsOptional()
  email?: string

  @ApiPropertyOptional({
    description: 'Facebook profile of the business',
    example: 'https://facebook.com/business',
  })
  @IsString()
  @IsOptional()
  facebook?: string

  @ApiPropertyOptional({
    description: 'Instagram profile of the business',
    example: 'https://instagram.com/business',
  })
  @IsString()
  @IsOptional()
  instagram?: string

  @ApiPropertyOptional({
    description: 'Telegram account of the business',
    example: 'https://t.me/business',
  })
  @IsString()
  @IsOptional()
  telegram?: string

  @ApiPropertyOptional({
    description: 'GitHub profile of the business',
    example: 'https://github.com/business',
  })
  @IsString()
  @IsOptional()
  github?: string

  @ApiPropertyOptional({
    description: 'LinkedIn profile of the business',
    example: 'https://linkedin.com/company/business',
  })
  @IsString()
  @IsOptional()
  linkedIn?: string
}
