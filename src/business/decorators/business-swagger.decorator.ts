import { applyDecorators, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
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
import StoryResponse from '../responses/story.response'

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
      type: BusinessResponse,
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
    ApiParam({ description: 'Susiness Id', name: 'businessId' }),
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
// business address

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
    ApiParam({ description: 'address Id', name: 'id' }),
  )

// business contact

export const UpdateBusinessContactSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business contact info' }),
    ApiResponse({
      description: 'Business contact updated successfully',
      type: BusinessAddressResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

//story related
export const AddStorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add  story ' }),
    ApiCreatedResponse({
      description: 'story  added successfully',
      type: StoryResponse,
    }),
    ApiForbiddenResponse({ description: 'Only allowed for business owner ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )
export const UpdatedStorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update  story ' }),
    ApiCreatedResponse({
      description: 'story updated successfully',
      type: StoryResponse,
    }),
    ApiForbiddenResponse({ description: 'Only allowed for business owner ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const DeleteStorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delte story ' }),
    ApiCreatedResponse({
      description: 'story deleted successfully',
      type: String,
    }),
    ApiForbiddenResponse({ description: 'Only allowed for business owner ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('image'),
  )

export const GetAllStoriesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Fetch stories ' }),
    ApiCreatedResponse({
      description: 'stories fetched successfully',
      type: Array<StoryResponse>,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const GetBusinessStoriesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Fetch business stories ' }),
    ApiCreatedResponse({
      description: 'Business stories fetched successfully',
      type: Array<StoryResponse>,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'bussinessId', description: 'bussiness id ' }),
  )
