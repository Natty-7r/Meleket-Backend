import { applyDecorators } from '@nestjs/common'
import Permissions from 'src/common/decorators/permission.decorator'
import {
  CreateBusinessAddressSwaggerDefinition,
  DeleteBusinessAddressSwaggerDefinition,
  GetBusinessAddressSwaggerDefinition,
  UpdateBusinessAddressSwaggerDefinition,
} from './business-swagger.decorator'
import Public from 'src/common/decorators/public.decorator'

export const CreateBusinessAddress = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_ADDRESS', action: 'CREATE' }),
    CreateBusinessAddressSwaggerDefinition(),
  )

export const UpdateBusinessAddress = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_ADDRESS', action: 'UPDATE' }),
    UpdateBusinessAddressSwaggerDefinition(),
  )

export const DeleteBusinessAddress = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_ADDRESS', action: 'DELETE' }),
    DeleteBusinessAddressSwaggerDefinition(),
  )
export const GetBusinessAddress = () =>
  applyDecorators(Public(), GetBusinessAddressSwaggerDefinition())
