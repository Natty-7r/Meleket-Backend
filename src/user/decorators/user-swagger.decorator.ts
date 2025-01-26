import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import ProfileResponse from '../responses/profile.response'

// follow related
export const FollowBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Follow a bussines' }),
    ApiCreatedResponse({
      description: 'Bussiness followed successfully ',
      type: String,
    }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiForbiddenResponse({
      description: 'Owner cannot follow  own business  ',
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UnFollowBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Unfollow a bussines' }),
    ApiCreatedResponse({
      description: 'Bussiness Unfollowed successfully ',
      type: String,
    }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetFollowedBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get Followed  bussines' }),
    ApiCreatedResponse({
      description: 'Followed Bussiness Unfollowed successfully ',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const FollowedBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get followed bussinesses' }),
    ApiCreatedResponse({
      description: 'Followed bussiness fetched successfully ',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

// profile

export const AddProfileSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add profile' }),
    ApiCreatedResponse({
      description: 'Profile added successfully',
      type: ProfileResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateProfileSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update profile' }),
    ApiCreatedResponse({
      description: 'Profile updated successfully',
      type: ProfileResponse,
    }),
    ApiBadRequestResponse({ description: 'No profile added' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const ViewStorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'View story' }),
    ApiCreatedResponse({
      description: 'Story view  successfully',
      type: ProfileResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid Story Id' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'storyId', description: 'story id ' }),
  )
