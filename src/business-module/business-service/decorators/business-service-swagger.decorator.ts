import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import BusinessServicerResponse from '../responses/business-service.response'

// business service related
export const AddBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add business service' }),
    ApiResponse({
      description: 'Business service added successfully',
      type: BusinessServicerResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Service name exist in the business' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const UpdateBusinessServiceImageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business service image' }),
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessServicerResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business service' }),
    ApiResponse({
      description: 'Business service image updated successfully',
      type: [BusinessServicerResponse],
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
export const DeleteBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete business service' }),
    ApiResponse({
      description: 'Business service deleted successfully',
      type: [BusinessServicerResponse],
    }),
    ApiBadRequestResponse({ description: 'Invalid business/service  Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ description: 'Service Id', name: 'id' }),
  )
export const GetBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get business service' }),
    ApiResponse({
      description: 'Business service fetched successfully',
      type: [BusinessServicerResponse],
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ description: 'Susiness Id', name: 'businessId' }),
  )
