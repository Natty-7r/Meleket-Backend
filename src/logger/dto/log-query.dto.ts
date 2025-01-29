import { ApiPropertyOptional } from '@nestjs/swagger'
import { LogType } from '@prisma/client'
import {
  IsEnum,
  IsOptional,
  IsInt,
  IsDateString,
  IsPositive,
} from 'class-validator'
import QueryDto from 'src/common/dto/query.dto'
import { TimeUnit } from 'src/common/types/base.type'

export class LogQueryDto extends QueryDto {
  @ApiPropertyOptional({
    description: 'Type of log (e.g., info, warn, error)',
    enum: LogType,
    required: false,
  })
  @IsEnum(LogType)
  @IsOptional()
  logType?: LogType

  @ApiPropertyOptional({
    description: 'Time unit for the timeframe (e.g., second, minute, hour)',
    enum: TimeUnit,
    required: false,
  })
  @IsEnum(TimeUnit)
  @IsOptional()
  timeUnit?: TimeUnit

  @ApiPropertyOptional({
    description: 'Timeframe value in the specified time unit (e.g., 10)',
    type: Number,
    required: false,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  timeFrame?: number

  @ApiPropertyOptional({
    description: 'Start date in ISO 8601 format',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date

  @ApiPropertyOptional({
    description: 'End date in ISO 8601 format',
    type: String,
    format: 'date-time',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date
}
