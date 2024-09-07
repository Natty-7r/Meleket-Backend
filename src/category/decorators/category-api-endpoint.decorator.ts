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

export const ApiEndpointDecorator = (...optionalDecorators: Function[]) =>
  applyDecorators(...(optionalDecorators as any))

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
    Roles('ADMIN', 'SUPER_ADMIN'),
    UpdateCategorySwaggerDefinition,
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      }),
    ),
  )
export const UpdateCategoryImage = () =>
  ApiEndpointDecorator(
    Roles('ADMIN', 'SUPER_ADMIN'),
    UpdateCategoryImageCategorySwaggerDefinition,
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
  )

export const VerifyCategory = () =>
  ApiEndpointDecorator(
    Roles('ADMIN', 'SUPER_ADMIN'),
    VerifyCategorySwaggerDefinition,
  )
export const GetCategories = () =>
  ApiEndpointDecorator(
    Roles('ADMIN', 'SUPER_ADMIN'),
    CategoryTreeSwaggerDefinition(
      'Get all categories',
      'Categories fetched successfully',
    ),
  )
export const DeleteCategory = () =>
  ApiEndpointDecorator(
    Roles('ADMIN', 'SUPER_ADMIN'),
    DeleteCategorySwaggerDefinition(),
  )
export const UpdateCategoryParent = () =>
  ApiEndpointDecorator(
    Roles('ADMIN', 'SUPER_ADMIN'),
    UpdateCategoryParentSwaggerDefinition(),
  )
