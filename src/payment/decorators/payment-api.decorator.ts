import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import Roles from 'src/common/decorators/roles.decorator'
import Public from 'src/common/decorators/public.decorator'
import {
  CreatePackageSwaggerDefinition,
  GetPackagesSwaggerDefinition,
  PurchasePackageSwaggerDefinition,
  UpdatePackageSwaggerDefinition,
} from './payment-swagger.decorator'

const ClientRole = () =>
  applyDecorators(
    Roles('CLIENT_USER'),
    ApiForbiddenResponse({ description: 'Only owner can manupulate' }),
  )
const AdminRole = () =>
  applyDecorators(
    Roles('ADMIN', 'SUPER_ADMIN'),
    ApiForbiddenResponse({ description: 'Only Admin have access ' }),
  )

export const PurchasePackage = () =>
  applyDecorators(ClientRole(), PurchasePackageSwaggerDefinition())
export const CreatePackage = () =>
  applyDecorators(AdminRole(), CreatePackageSwaggerDefinition())
export const UpdatePackage = () =>
  applyDecorators(AdminRole(), UpdatePackageSwaggerDefinition())
export const GetPackages = () =>
  applyDecorators(Public(), GetPackagesSwaggerDefinition())
