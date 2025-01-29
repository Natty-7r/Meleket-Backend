import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import Permissions from 'src/common/decorators/permission.decorator'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import {
  AddProfileSwaggerDefinition,
  FollowBusinessSwaggerDefinition,
  FollowedBusinessSwaggerDefinition,
  GetFollowedBusinessSwaggerDefinition,
  UnFollowBusinessSwaggerDefinition,
  UpdateProfileSwaggerDefinition,
  ViewStorySwaggerDefinition,
} from './user-swagger.decorator'

// follow related

export const FollowBusiness = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'CREATE' }),
    FollowBusinessSwaggerDefinition(),
  )

export const UnFollowBusiness = () =>
  applyDecorators(
    Permissions({ model: 'REVIEW', action: 'DELETE' }),
    UnFollowBusinessSwaggerDefinition(),
  )

export const GetFollowedBusiness = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    GetFollowedBusinessSwaggerDefinition(),
  )

export const FollowedBusinesses = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    FollowedBusinessSwaggerDefinition(),
  )

// profile
export const AddProfile = () =>
  applyDecorators(
    Permissions({ model: 'PROFILE', action: 'CREATE' }),
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
    Permissions({ model: 'PROFILE', action: 'UPDATE' }),
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
  applyDecorators(
    Permissions({ model: 'STORY', action: 'READ' }),
    ViewStorySwaggerDefinition(),
  )
