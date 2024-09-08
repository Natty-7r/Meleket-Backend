import { applyDecorators, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'
import BusinessResponse from '../responses/business.response'
import BusinessServicerResponse from '../responses/business-service.response'
import BusinessDetailResponse from '../responses/business-detail.response'
import BusinessAddressResponse from '../responses/business-address.response'

export const CreateBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Create business ' }),
    ApiCreatedResponse({
      description: 'Create Business successfully',
      type: BusinessResponse,
    }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
export const UpdateBusinessImageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update buiness image' }),
    ApiResponse({
      description: 'Business image updated successfully',
      type: BusinessResponse,
    }),
    ApiParam({ description: 'business Id', name: 'id' }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const UpdateBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update business' }),
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

// business service related
export const AddBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Add business service' }),
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
    ApiOperation({ description: 'Update business service image' }),
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateBusinessServiceSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update business service' }),
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
    ApiOperation({ description: 'Delete business service' }),
    ApiResponse({
      description: 'Business service deleted successfully',
      type: [BusinessServicerResponse],
    }),
    ApiBadRequestResponse({ description: 'Invalid business/service  Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ description: 'Service Id', name: 'id' }),
    ApiParam({ description: 'Susiness Id', name: 'businessId' }),
  )

export const SearchBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Search business by key' }),
    ApiResponse({
      description: 'Business for search.key fetched successfully',
      type: [BusinessResponse],
    }),
    ApiNotFoundResponse({ description: 'not business found for search.key' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiQuery({ description: 'search key', name: 'searchKey' }),
  )

export const GetBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Get all businesses' }),
    ApiResponse({
      description: 'All Business fetched successfully',
      type: [BusinessResponse],
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetBussinesDetailSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Get business detail' }),
    ApiResponse({
      description: 'All Business fetched successfully',
      type: BusinessDetailResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetCategoryBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Get business by category' }),
    ApiResponse({
      description: 'category.name business fetched successfully',
      type: [BusinessResponse],
    }),
    ApiParam({ description: 'category  Id', name: 'categoryId' }),
    ApiBadRequestResponse({ description: 'Invalid category Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
// business address

export const CreateBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Add business address' }),
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
    ApiOperation({ description: 'Update business address' }),
    ApiResponse({
      description: 'Business address  updated successfully',
      type: BusinessAddressResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const DeleteBusinessAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Delete business address' }),
    ApiResponse({
      description: 'Business address  deleted successfully',
      type: String,
    }),
    ApiBadRequestResponse({ description: 'Invalid address Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ description: 'address Id', name: 'id' }),
  )

// business contact

export const UpdateBusinessContactSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update business contact info' }),
    ApiResponse({
      description: 'Business contact updated successfully',
      type: BusinessAddressResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
