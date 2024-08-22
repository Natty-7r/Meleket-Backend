import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import CreateBusinessResponse from '../responses/create-business.response'

export const CreateBussinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({
      description: 'Create Business successfully',
    }),
    ApiCreatedResponse({
      type: CreateBusinessResponse,
    }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
export const UpdateBussinessImageSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business image updated successfully',
      type: CreateBusinessResponse,
    }),
    ApiParam({ description: 'business Id', name: 'id' }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
