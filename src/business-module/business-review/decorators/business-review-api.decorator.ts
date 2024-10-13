import { applyDecorators } from '@nestjs/common'
import Permissions from 'src/common/decorators/permission.decorator'
import Public from 'src/common/decorators/public.decorator'
import {
  AddReviewSwaggerDefinition,
  DeleteReviewSwaggerDefinition,
  GetReviewDetailSwaggerDefinition,
  GetReviewsSwaggerDefinition,
  UpdateReviewSwaggerDefinition,
} from './business-review-swagger.decorator'

export const AddReview = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'CREATE' }),
    AddReviewSwaggerDefinition(),
  )

export const UpdateReview = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'UPDATE' }),
    UpdateReviewSwaggerDefinition(),
  )

export const DeleteReview = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'DELETE' }),
    DeleteReviewSwaggerDefinition(),
  )

export const GetReviews = () =>
  applyDecorators(Public(), GetReviewsSwaggerDefinition())

export const GetReviewDetail = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'READ' }),
    GetReviewDetailSwaggerDefinition(),
  )
