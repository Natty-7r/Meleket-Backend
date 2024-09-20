import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, {
  multerFilter,
} from 'src/common/util/helpers/multer.helper'
import Roles from 'src/common/decorators/roles.decorator'
import {
  CreateCategorySwaggerDefinition,
  DeleteCategorySwaggerDefinition,
  UpdateCategoryParentSwaggerDefinition,
  UpdateCategoryImageSwaggerDefinition,
  UpdateCategorySwaggerDefinition,
  VerifyCategorySwaggerDefinition,
  GetCategoriesSwaggerDefinition,
} from './category-swagger.decorator'
import { GetCategoryBusinessSwaggerDefinition } from 'src/business/decorators/business-swagger.decorator'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'

const AdminRole = () =>
  applyDecorators(
    Roles('ADMIN', 'SUPER_ADMIN'),
    ApiUnauthorizedResponse({ description: 'Insucffincent permission' }),
  )

export const CreateCategory = () =>
  applyDecorators(
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
    AdminRole(),
    UpdateCategorySwaggerDefinition(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      }),
    ),
  )
export const UpdateCategoryImage = () =>
  applyDecorators(
    AdminRole(),
    UpdateCategoryImageSwaggerDefinition(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
  )

export const VerifyCategory = () =>
  applyDecorators(AdminRole(), VerifyCategorySwaggerDefinition())

export const GetCategories = () =>
  applyDecorators(AdminRole(), GetCategoriesSwaggerDefinition())

export const DeleteCategory = () =>
  applyDecorators(AdminRole(), DeleteCategorySwaggerDefinition())

export const UpdateCategoryParent = () =>
  applyDecorators(AdminRole(), UpdateCategoryParentSwaggerDefinition())

export const GetCategoryBusinesses = () =>
  applyDecorators(Public(), GetCategoryBusinessSwaggerDefinition())
