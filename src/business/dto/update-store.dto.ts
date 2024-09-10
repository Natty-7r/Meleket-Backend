import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator'
import { StoryContentType } from '@prisma/client' // Adjust import based on your setup

export default class UpdateStoryDto {
  @ApiPropertyOptional({
    description: 'Content type of the story',
    example: 'STRING',
    enum: StoryContentType,
  })
  @IsEnum(StoryContentType)
  @IsOptional()
  contentType?: StoryContentType

  @ApiPropertyOptional({
    description: 'Text content of the story',
    example: 'This is an updated story text.',
  })
  @IsString()
  @IsOptional()
  text?: string

  @ApiPropertyOptional({
    description: 'Optional image URL for the story',
    example: 'https://example.com/new-image.jpg',
  })
  @IsString()
  @IsOptional()
  image?: string

  @ApiProperty({
    description: 'Unique identifier for the the story',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsOptional()
  id: string
}
