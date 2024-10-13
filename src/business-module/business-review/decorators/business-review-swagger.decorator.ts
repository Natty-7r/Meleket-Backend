import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger'
import ReviewResponse from '../responses/review-response'

export const AddReviewSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Add review  ' }),
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
    ApiOperation({ summary: 'Updated review  ' }),
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
    ApiOperation({ summary: 'Remove review  ' }),
    ApiCreatedResponse({
      description: 'Review delted  successfully',
      type: String,
    }),
    ApiNotFoundResponse({ description: 'Review not found ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'review ID' }),
  )
export const GetReviewsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get Business reviews  ' }),
    ApiCreatedResponse({
      description: 'Reviews fetched  successfully',
      type: String,
    }),
    ApiNotFoundResponse({ description: 'business  not found ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'businessId', description: 'business ID' }),
  )

export const GetReviewDetailSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get Review detail  ' }),
    ApiCreatedResponse({
      description: 'Review detail fetched  successfully',
      type: String,
    }),
    ApiNotFoundResponse({ description: 'Review not found ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'review ID' }),
  )
