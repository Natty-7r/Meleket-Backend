import { applyDecorators } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const ViewFileLogsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'View file Logs' }),
    ApiCreatedResponse({
      description: 'Logs Fetched successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const ViewLogsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'View Logs' }),
    ApiCreatedResponse({
      description: 'Logs Fetched successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const ArchiveLogsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Archive logs' }),
    ApiCreatedResponse({
      description: 'Logs arhived successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
