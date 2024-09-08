import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import {
  AddReviewSwaggerDefinition,
  DeleteReviewSwaggerDefinition,
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
