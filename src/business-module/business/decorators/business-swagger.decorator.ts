import { applyDecorators } from '@nestjs/common'
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
import BusinessDetailResponse from '../responses/business-detail.response'
import BusinessContactResponse from '../responses/business-contact.response'

export const CreateBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create business ' }),
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
    ApiOperation({ summary: 'Update buiness image' }),
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
    ApiOperation({ summary: 'Update business' }),
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiConflictResponse({ description: 'Business name already taken' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const SearchBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Search business by key' }),
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
    ApiOperation({ summary: 'Get all businesses' }),
    ApiResponse({
      description: 'All Business fetched successfully',
      type: [BusinessResponse],
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetBussinesDetailSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get business detail' }),
    ApiResponse({
      description: 'All Business fetched successfully',
      type: BusinessDetailResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetCategoryBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get businesses by category' }),
    ApiResponse({
      description: 'Category businesses fetched successfully',
      type: [BusinessResponse], // Assuming this contains the business data
    }),
    ApiParam({
      description: 'Category ID',
      name: 'id',
      required: true,
      type: 'string',
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number for pagination (default: 1)',
      required: false,
      type: 'number',
    }),
    ApiQuery({
      name: 'items',
      description: 'Number of items per page (default: 10)',
      required: false,
      type: 'number',
    }),
    ApiQuery({
      name: 'sort',
      description: 'Fields to sort by (e.g., averageRating, name)',
      required: false,
      type: 'string',
      isArray: true, // Indicates that this query parameter can be an array
    }),
    ApiQuery({
      name: 'sortType',
      description: 'Sort direction (asc or desc)',
      required: false,
      type: 'string',
      enum: ['asc', 'desc'], // Define accepted values
    }),
    ApiBadRequestResponse({ description: 'Invalid category ID' }),
  )

export const UpdateBusinessContactSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business contact info' }),
    ApiResponse({
      description: 'Business contact updated successfully',
      type: BusinessContactResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
