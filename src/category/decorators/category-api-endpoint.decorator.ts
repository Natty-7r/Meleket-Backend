import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import {
  CreateCategorySwaggerDefinition,
  DeleteCategorySwaggerDefinition,
  UpdateCategoryParentSwaggerDefinition,
  UpdateCategorySwaggerDefinition,
  VerifyCategorySwaggerDefinition,
  GetCategoriesSwaggerDefinition,
} from './category-swagger.decorator'
import Public from 'src/common/decorators/public.decorator'
import Permissions from 'src/common/decorators/permission.decorator'
import { GetCategoryBusinessSwaggerDefinition } from 'src/business-module/business/decorators/business-swagger.decorator'

export const CreateCategory = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'CREATE' }),
    CreateCategorySwaggerDefinition(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
  )

export const UpdateCategory = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'UPDATE' }),
    UpdateCategorySwaggerDefinition(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      }),
    ),
  )

export const VerifyCategory = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'UPDATE' }),
    VerifyCategorySwaggerDefinition(),
  )

export const GetCategories = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'READ' }),
    GetCategoriesSwaggerDefinition(),
  )

export const DeleteCategory = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'DELETE' }),
    DeleteCategorySwaggerDefinition(),
  )

export const UpdateCategoryParent = () =>
  applyDecorators(
    Permissions({ model: 'CATEGORY', action: 'UPDATE' }),
    UpdateCategoryParentSwaggerDefinition(),
  )

export const GetCategoryBusinesses = () =>
  applyDecorators(Public(), GetCategoryBusinessSwaggerDefinition())
