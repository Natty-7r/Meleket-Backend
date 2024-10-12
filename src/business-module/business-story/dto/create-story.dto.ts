import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator'
import { StoryContentType } from '@prisma/client' // Adjust import based on your setup

export default class CreateStoryDto {
  @ApiProperty({
    description: 'Unique identifier for the business associated with the story',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({
    description: 'Content type of the story',
    example: 'STRING',
    enum: StoryContentType,
  })
  @IsEnum(StoryContentType)
  @IsNotEmpty()
  contentType: StoryContentType

  @ApiProperty({
    description: 'Text content of the story',
    example: 'This is a sample story text.',
    required: true,
  })
  @IsString()
  @IsOptional()
  text?: string

  @ApiPropertyOptional({
    description: 'Optional image URL for the story',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string
}
