import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import Permissions from 'src/common/decorators/permission.decorator'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import {
  AddBusinessServiceSwaggerDefinition,
  DeleteBusinessServiceSwaggerDefinition,
  GetBusinessServiceSwaggerDefinition,
  UpdateBusinessServiceSwaggerDefinition,
} from './business-service-swagger.decorator'

export const AddBusinessService = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_SERVICE', action: 'CREATE' }),
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
  applyDecorators(
    Permissions({ model: 'BUSINESS_SERVICE', action: 'UPDATE' }),
    UpdateBusinessServiceSwaggerDefinition(),
  )

export const DeleteBusinessService = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_SERVICE', action: 'DELETE' }),
    DeleteBusinessServiceSwaggerDefinition(),
  )
export const GetBusinessService = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_SERVICE', action: 'READ' }),
    GetBusinessServiceSwaggerDefinition(),
  )
