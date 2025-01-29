import { applyDecorators } from '@nestjs/common'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import StoryResponse from '../responses/story.response'

export const AddStorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add  story ' }),
    ApiCreatedResponse({
      description: 'story  added successfully',
      type: StoryResponse,
    }),
    ApiForbiddenResponse({ description: 'Only allowed for business owner ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiConsumes('multipart/form-data'),
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
    ApiConsumes('multipart/form-data'),
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
