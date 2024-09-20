import { applyDecorators } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'

export const ViewLogsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'View Logs' }),
    ApiCreatedResponse({
      description: 'Logs Fetched successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
