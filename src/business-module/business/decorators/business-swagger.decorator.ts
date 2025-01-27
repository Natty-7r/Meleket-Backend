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
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'
import CreateBusinessDto from '../dto/create-business.dto'
import BusinessContactResponse from '../responses/business-contact.response'
import BusinessDetailResponse from '../responses/business-detail.response'
import BusinessResponse from '../responses/business.response'

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

export const UpdateBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update business' }),
    ApiResponse({
      description: 'Business  updated successfully',
      type: BusinessResponse,
    }),
    ApiConsumes('multipart/form-data'),
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
