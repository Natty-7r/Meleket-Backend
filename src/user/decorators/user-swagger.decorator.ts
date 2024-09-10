import { applyDecorators, NotFoundException, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger'
import ReviewResponse from '../responses/review-response'
import RatingResponse from '../responses/rating.response'
import ProfileResponse from '../responses/profile.response'

export const AddReviewSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Add review  ' }),
    ApiCreatedResponse({
      description: 'Review  added  successfully',
      type: ReviewResponse,
    }),
    ApiConflictResponse({
      description: 'User can only add one review for a business',
    }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiForbiddenResponse({ description: 'Owner cannot add review' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const UpdateReviewSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Updated review  ' }),
    ApiCreatedResponse({
      description: 'Review updated  successfully',
      type: ReviewResponse,
    }),
    ApiNotFoundResponse({ description: 'Review not found ' }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const DeleteReviewSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Remove review  ' }),
    ApiCreatedResponse({
      description: 'Review delted  successfully',
      type: String,
    }),
    ApiNotFoundResponse({ description: 'Review not found ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'review ID' }),
  )

// rating related

export const AddRatingSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Rate a bussines' }),
    ApiCreatedResponse({
      description: 'Rate added successfully',
      type: RatingResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiForbiddenResponse({ description: 'Owner cannot rate own business  ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

// follow related
export const FollowBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Follow a bussines' }),
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
    ApiOperation({ description: 'Unfollow a bussines' }),
    ApiCreatedResponse({
      description: 'Bussiness Unfollowed successfully ',
      type: String,
    }),
    ApiBadRequestResponse({ description: 'Invalid business ID' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const FollowedBusinessSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Get followed bussinesses' }),
    ApiCreatedResponse({
      description: 'Followed bussiness fetched successfully ',
      type: String,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

// profile

export const AddProfileSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Add profile' }),
    ApiCreatedResponse({
      description: 'Profile added successfully',
      type: ProfileResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateProfileSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update profile' }),
    ApiCreatedResponse({
      description: 'Profile updated successfully',
      type: ProfileResponse,
    }),
    ApiBadRequestResponse({ description: 'No profile added' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
