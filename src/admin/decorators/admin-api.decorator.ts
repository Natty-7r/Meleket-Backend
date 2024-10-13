import Permissions from 'src/common/decorators/permission.decorator'
import { applyDecorators } from '@nestjs/common'
import {
  CreateAdminSwaggerDefinition,
  DeleteAdminSwaggerDefinition,
  GetAdminsSwaggerDefinition,
  UpdateAdminStatusSwaggerDefinition,
  UpdateAdminSwaggerDefinition,
} from './admin-swagger.decorator'

export const CreateAdminAccount = () =>
  applyDecorators(
    Permissions({ model: 'ADMIN', action: 'CREATE' }),
    CreateAdminSwaggerDefinition(),
  )
export const UpdateAdmin = () =>
  applyDecorators(
    Permissions({ model: 'ADMIN', action: 'UPDATE' }),
    UpdateAdminSwaggerDefinition(),
  )
export const UpdateAdminStatus = () =>
  applyDecorators(
    Permissions({ model: 'ADMIN', action: 'UPDATE' }),
    UpdateAdminStatusSwaggerDefinition(),
  )
export const DeleteAdmin = () =>
  applyDecorators(
    Permissions({ model: 'ADMIN', action: 'DELETE' }),
    DeleteAdminSwaggerDefinition(),
  )

export const GetAdmins = () =>
  applyDecorators(
    Permissions({ model: 'ADMIN', action: 'READ' }),
    GetAdminsSwaggerDefinition(),
  )
