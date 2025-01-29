import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger'
import BusinessAddressResponse from '../responses/business-address.response'

export const CreateBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add business address' }),
    ApiResponse({
      description: 'Business address  added successfully',
      type: BusinessAddressResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business address  already exists' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const UpdateBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business address' }),
    ApiResponse({
      description: 'Business address  updated successfully',
      type: BusinessAddressResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const DeleteBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete business address' }),
    ApiResponse({
      description: 'Business address  deleted successfully',
      type: String,
    }),
    ApiBadRequestResponse({ description: 'Invalid address Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get business address' }),
    ApiResponse({
      description: 'Business address  fetched successfully',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
