import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
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
import CreateBusinessDto from '../dto/create-business.dto'

export const CreateBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create business' }),
    ApiCreatedResponse({
      description: 'Business created successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
    ApiConflictResponse({ description: 'Category with the same name exists' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateBusinessDto,
      description: 'business creation data',
    }),
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
