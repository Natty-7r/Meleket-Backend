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
import { BusinessServicerResponse } from '../responses/business-service.response'
import BusinessDetailResponse from '../responses/business-detail.response'

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

export const SearchBusinessBYNameUDescriptionSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Search business by name U description' }),
    ApiResponse({
      description: 'Business for name | description .key fetched successfully',
      type: [BusinessResponse],
    }),
    ApiNotFoundResponse({
      description: 'not business found for name | description .key',
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiQuery({ description: 'business description ', name: 'description' }),
    ApiQuery({ description: 'business name ', name: 'name' }),
  )

export const SearchBusinessByAddressSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Search business by name U description' }),
    ApiResponse({
      description: 'Business for name | description .key fetched successfully',
      type: [BusinessResponse],
    }),
    ApiNotFoundResponse({
      description: 'not business found for name | description .key',
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiQuery({ description: 'business address', name: 'address' }),
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
