import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { MAX_IMAGE_UPLOAD_COUNT } from 'src/common/constants/base.constants'
import Permissions from 'src/common/decorators/permission.decorator'
import Public from 'src/common/decorators/public.decorator'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import {
  AddStorySwaggerDefinition,
  DeleteStorySwaggerDefinition,
  GetAllStoriesSwaggerDefinition,
  GetBusinessStoriesSwaggerDefinition,
} from './business-story-swagger.decorator'

export const AddStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'CREATE' }),
    UseInterceptors(
      FilesInterceptor('images', MAX_IMAGE_UPLOAD_COUNT, {
        storage: muluterStorage({ folder: 'story', filePrefix: 's' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddStorySwaggerDefinition(),
  )

export const UpdateStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'UPDATE' }),
    UseInterceptors(
      FilesInterceptor('images', MAX_IMAGE_UPLOAD_COUNT, {
        storage: muluterStorage({ folder: 'story', filePrefix: 's' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddStorySwaggerDefinition(),
  )
export const DeleteStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'DELETE' }),
    DeleteStorySwaggerDefinition(),
  )

export const GetAllStories = () =>
  applyDecorators(Public(), GetAllStoriesSwaggerDefinition())

export const GetBusinessStories = () =>
  applyDecorators(Public(), GetBusinessStoriesSwaggerDefinition())
