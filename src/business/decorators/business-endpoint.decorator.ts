import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import {
  UpdateBussinessImageSwaggerDefinition,
  CreateBussinessSwaggerDefinition,
  UpdateBussinessSwaggerDefinition,
  AddBussinessServiceSwaggerDefinition,
  UpdateBussinessServiceImageSwaggerDefinition,
  UpdateBussinessServiceSwaggerDefinition,
} from './business-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/util/helpers/multer'
import { ApiForbiddenResponse } from '@nestjs/swagger'

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
    CreateBussinessSwaggerDefinition(),
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
    UpdateBussinessImageSwaggerDefinition(),
  )

export const UpdateBusiness = () =>
  applyDecorators(Roles('CLIENT_USER'), UpdateBussinessSwaggerDefinition())

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
    AddBussinessServiceSwaggerDefinition(),
  )

export const UpdateBusinessServices = () =>
  applyDecorators(ClientRole, UpdateBussinessServiceSwaggerDefinition())

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
    UpdateBussinessServiceImageSwaggerDefinition(),
  )
