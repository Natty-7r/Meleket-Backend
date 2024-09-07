import { applyDecorators, UseInterceptors } from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/util/helpers/multer'
import Roles from 'src/common/decorators/roles.decorator'
import {
  CategoryTreeSwaggerDefinition,
  CreateCategorySwaggerDefinition,
  DeleteCategorySwaggerDefinition,
  UpdateCategoryParentSwaggerDefinition,
  UpdateCategoryImageCategorySwaggerDefinition,
  UpdateCategorySwaggerDefinition,
  VerifyCategorySwaggerDefinition,
} from './category-swagger.decorator'
import { GetCategoryBusinessSwaggerDefinition } from 'src/business/decorators/business-swagger.decorator'
import { ApiUnauthorizedResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'

export const ApiEndpointDecorator = (...optionalDecorators: Function[]) =>
  applyDecorators(...(optionalDecorators as any))

const AdminRole = () =>
  applyDecorators(
    Roles('ADMIN', 'SUPER_ADMIN'),
    ApiUnauthorizedResponse({ description: 'Only owner can manupulate' }),
  )

export const CreateCategory = () =>
  ApiEndpointDecorator(
    CreateCategorySwaggerDefinition,
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
  )

export const UpdateCategory = () =>
  ApiEndpointDecorator(
    AdminRole(),
    UpdateCategorySwaggerDefinition,
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      }),
    ),
  )
export const UpdateCategoryImage = () =>
  ApiEndpointDecorator(
    AdminRole(),
    UpdateCategoryImageCategorySwaggerDefinition,
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
  )

export const VerifyCategory = () =>
  ApiEndpointDecorator(AdminRole(), VerifyCategorySwaggerDefinition)
export const GetCategories = () =>
  ApiEndpointDecorator(
    AdminRole(),
    CategoryTreeSwaggerDefinition(
      'Get all categories',
      'Categories fetched successfully',
    ),
  )
export const DeleteCategory = () =>
  ApiEndpointDecorator(AdminRole(), DeleteCategorySwaggerDefinition())
export const UpdateCategoryParent = () =>
  ApiEndpointDecorator(AdminRole(), UpdateCategoryParentSwaggerDefinition())

export const GetCategoryBusinesses = () =>
  applyDecorators(Public(), GetCategoryBusinessSwaggerDefinition())
