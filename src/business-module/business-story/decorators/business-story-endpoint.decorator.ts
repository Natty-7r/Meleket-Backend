import { applyDecorators, UseInterceptors } from '@nestjs/common'
import {
  AddStorySwaggerDefinition,
  DeleteStorySwaggerDefinition,
  GetAllStoriesSwaggerDefinition,
  GetBusinessStoriesSwaggerDefinition,
} from './business-story-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import Public from 'src/common/decorators/public.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

export const AddStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'CREATE' }),
    UseInterceptors(
      FileInterceptor('image', {
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
      FileInterceptor('image', {
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
