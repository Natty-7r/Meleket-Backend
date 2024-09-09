import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import {
  AddRatingSwaggerDefinition,
  AddReviewSwaggerDefinition,
  DeleteReviewSwaggerDefinition,
  FollowBusinessSwaggerDefinition,
  FollowedBusinessSwaggerDefinition,
  UnFollowBusinessSwaggerDefinition,
  UpdateReviewSwaggerDefinition,
} from './user-swagger.decorator'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'

const ClientRole = () =>
  applyDecorators(
    Roles('CLIENT_USER'),
    ApiForbiddenResponse({
      description: 'Only client can user has privilage ',
    }),
  )
export const AddReveiw = () =>
  applyDecorators(ClientRole(), AddReviewSwaggerDefinition())

export const UpdateReview = () =>
  applyDecorators(ClientRole(), UpdateReviewSwaggerDefinition())

export const DeleteReview = () =>
  applyDecorators(ClientRole(), DeleteReviewSwaggerDefinition())

export const AddRating = () =>
  applyDecorators(ClientRole(), AddRatingSwaggerDefinition())

// follow related

export const FollowBusiness = () =>
  applyDecorators(ClientRole(), FollowBusinessSwaggerDefinition())

export const UnFollowBusiness = () =>
  applyDecorators(ClientRole(), UnFollowBusinessSwaggerDefinition())

export const FollowedBusinesses = () =>
  applyDecorators(ClientRole(), FollowedBusinessSwaggerDefinition())
