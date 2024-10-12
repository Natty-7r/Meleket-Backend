import { applyDecorators, UseInterceptors } from '@nestjs/common'
import {
  UpdateBusinessImageSwaggerDefinition,
  CreateBusinessSwaggerDefinition,
  UpdateBusinessSwaggerDefinition,
  SearchBusinessSwaggerDefinition,
  GetBusinessSwaggerDefinition,
  GetBussinesDetailSwaggerDefinition,
  UpdateBusinessContactSwaggerDefinition,
} from './business-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import Public from 'src/common/decorators/public.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

export const CreateBusiness = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'CREATE' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'business', filePrefix: 'b' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    CreateBusinessSwaggerDefinition(),
  )

export const UpdateBusinessImage = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'UPDATE' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'business', filePrefix: 'b' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
    UpdateBusinessImageSwaggerDefinition(),
  )

export const UpdateBusiness = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'UPDATE' }),
    UpdateBusinessSwaggerDefinition(),
  )

export const GetBusinesses = () =>
  applyDecorators(Public(), GetBusinessSwaggerDefinition())

export const GetUserBusinesses = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    GetBusinessSwaggerDefinition(),
  )

export const GetBusinessDetail = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    GetBussinesDetailSwaggerDefinition(),
  )

export const SearchBusiness = () =>
  applyDecorators(Public(), SearchBusinessSwaggerDefinition())

// bussiness contact

export const UpdateBusinessContact = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_CONTACT', action: 'UPDATE' }),
    UpdateBusinessContactSwaggerDefinition(),
  )
