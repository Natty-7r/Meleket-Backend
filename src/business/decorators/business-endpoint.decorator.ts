import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import {
  UpdateBusinessImageSwaggerDefinition,
  CreateBusinessSwaggerDefinition,
  UpdateBusinessSwaggerDefinition,
  AddBusinessServiceSwaggerDefinition,
  UpdateBusinessServiceImageSwaggerDefinition,
  UpdateBusinessServiceSwaggerDefinition,
  GetCategoryBusinessSwaggerDefinition,
  SearchBusinessSwaggerDefinition,
  GetBusinessSwaggerDefinition,
  GetBussinesDetailSwaggerDefinition,
} from './business-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/util/helpers/multer'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import { Public } from 'src/common/decorators/public.decorator'

const ClientRole = () =>
  applyDecorators(
    Roles('CLIENT_USER'),
    ApiForbiddenResponse({ description: 'Only owner can manupulate' }),
  )
export const CreateBusiness = () =>
  applyDecorators(
    ClientRole(),
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
    ClientRole(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'business', filePrefix: 'b' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
    UpdateBusinessImageSwaggerDefinition(),
  )

export const UpdateBusiness = () =>
  applyDecorators(Roles('CLIENT_USER'), UpdateBusinessSwaggerDefinition())

export const AddBusinessService = () =>
  applyDecorators(
    ClientRole(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({
          folder: 'business/service',
          filePrefix: 'b',
        }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddBusinessServiceSwaggerDefinition(),
  )

export const UpdateBusinessServices = () =>
  applyDecorators(ClientRole, UpdateBusinessServiceSwaggerDefinition())

export const UpdateBusinessServiceImage = () =>
  applyDecorators(
    ClientRole(),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({
          folder: 'business/service',
          filePrefix: 'b',
        }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
        }),
      }),
    ),
    UpdateBusinessServiceImageSwaggerDefinition(),
  )

export const GetBusinesses = () =>
  applyDecorators(Public(), GetBusinessSwaggerDefinition())

export const GetUserBusinesses = () =>
  applyDecorators(ClientRole(), GetBusinessSwaggerDefinition())

export const GetBusinessDetail = () =>
  applyDecorators(Public(), GetBussinesDetailSwaggerDefinition())

export const GetCategoryBusinesses = () =>
  applyDecorators(Public(), GetCategoryBusinessSwaggerDefinition())

export const SearchBusiness = () =>
  applyDecorators(Public(), SearchBusinessSwaggerDefinition())
