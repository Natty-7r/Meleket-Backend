import { applyDecorators } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const ViewLogsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'View Logs' }),
    ApiCreatedResponse({
      description: 'Logs Fetched successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
