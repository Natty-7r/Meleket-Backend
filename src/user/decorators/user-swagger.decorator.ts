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
import ReviewResponse from '../responses/review-respone'

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
