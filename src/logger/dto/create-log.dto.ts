import { ApiProperty } from '@nestjs/swagger'
import { LogType } from '@prisma/client'
import { IsNotEmpty, IsString, IsOptional, IsDate } from 'class-validator'

export default class CreateLogDto {
  @ApiProperty({
    type: String,
    example: 'USER_ACTIVITY',
    description: 'Type of log entry (e.g., INFO, ERROR)',
  })
  @IsString()
  @IsNotEmpty()
  logType: LogType

  @ApiProperty({
    type: String,
    example: 'User created account',
    description: 'Message describing the log entry',
  })
  @IsString()
  @IsNotEmpty()
  message: string

  @ApiProperty({
    type: String,
    example: 'Auth Service',
    description: 'Context of the log entry',
    required: false,
  })
  @IsString()
  @IsOptional()
  context?: string

  @ApiProperty({
    type: String,
    example: '2023-09-21T10:00:00Z',
    description: 'Timestamp of the log entry',
    required: false,
  })
  @IsDate()
  @IsOptional()
  timestamp?: Date

  @ApiProperty({
    type: String,
    example: '123',
    description: 'ID of the user associated with the log entry',
    required: false,
  })
  @IsString()
  @IsOptional()
  userId?: string

  @ApiProperty({
    type: String,
    example: '456',
    description: 'ID of the admin associated with the log entry',
    required: false,
  })
  @IsString()
  @IsOptional()
  adminId?: string
}
