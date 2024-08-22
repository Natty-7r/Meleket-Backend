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
import BusinessResponse from '../responses/business.response'
import { BusinessServicerResponse } from '../responses/business-service.response'

export const CreateBussinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({
      description: 'Create Business successfully',
    }),
    ApiCreatedResponse({
      type: BusinessResponse,
    }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
export const UpdateBussinessImageSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business image updated successfully',
      type: BusinessResponse,
    }),
    ApiParam({ description: 'business Id', name: 'id' }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const UpdateBussinessSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const AddBussinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business service added successfully',
      type: BusinessServicerResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Service name exist in the business' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const UpdateBussinessServiceImageSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateBussinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiResponse({
      description: 'Business service image updated successfully',
      type: Array<BusinessServicerResponse>,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
