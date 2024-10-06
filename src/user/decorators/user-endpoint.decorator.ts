import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import {
  AddProfileSwaggerDefinition,
  AddRatingSwaggerDefinition,
  AddReviewSwaggerDefinition,
  DeleteReviewSwaggerDefinition,
  FollowBusinessSwaggerDefinition,
  FollowedBusinessSwaggerDefinition,
  UnFollowBusinessSwaggerDefinition,
  GetFollowedBusinessSwaggerDefinition,
  UpdateProfileSwaggerDefinition,
  UpdateReviewSwaggerDefinition,
  ViewStorySwaggerDefinition,
} from './user-swagger.decorator'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'

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

export const GetFollowedBusiness = () =>
  applyDecorators(ClientRole(), GetFollowedBusinessSwaggerDefinition())

export const FollowedBusinesses = () =>
  applyDecorators(ClientRole(), FollowedBusinessSwaggerDefinition())

// profile
export const AddProfile = () =>
  applyDecorators(
    ClientRole(),
    UseInterceptors(
      FileInterceptor('profilePicture', {
        storage: muluterStorage({ folder: 'profile', filePrefix: 'p' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddProfileSwaggerDefinition(),
  )

export const UpdateProfile = () =>
  applyDecorators(
    ClientRole(),
    UseInterceptors(
      FileInterceptor('profilePicture', {
        storage: muluterStorage({ folder: 'profile', filePrefix: 'p' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    UpdateProfileSwaggerDefinition(),
  )

// story related
export const ViewStory = () =>
  applyDecorators(ClientRole(), ViewStorySwaggerDefinition())
