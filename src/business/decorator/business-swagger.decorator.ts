import { applyDecorators } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateBusinessResponse from '../dto/create-business.dto'

export const CreateBussinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({
      description: 'Create Business',
    }),
    ApiCreatedResponse({
      type: CreateBusinessResponse,
    }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
