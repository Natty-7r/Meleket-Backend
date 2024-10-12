import { applyDecorators } from '@nestjs/common'
import Permissions from 'src/common/decorators/permission.decorator'
import {
  CreateBusinessAddressSwaggerDefinition,
  DeleteBusinessAddressSwaggerDefinition,
  UpdateBusinessAddressSwaggerDefinition,
} from './business-swagger.decorator'

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
  applyDecorators(
    Permissions({ model: 'BUSINESS_ADDRESS', action: 'READ' }),
    DeleteBusinessAddressSwaggerDefinition(),
  )
