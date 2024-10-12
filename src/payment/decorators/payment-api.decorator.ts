import { applyDecorators, UseInterceptors } from '@nestjs/common'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'
import {
  BillPackageSwaggerDefinition,
  CreatePackageSwaggerDefinition,
  GetPackagesSwaggerDefinition,
  PurchasePackageSwaggerDefinition,
  UpdatePackageSwaggerDefinition,
} from './payment-swagger.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

const ClientRole = () =>
  applyDecorators(
    Permissions(),
    ApiForbiddenResponse({ description: 'Only owner can manupulate' }),
  )
const AdminRole = () =>
  applyDecorators(
    Permissions(),
    ApiForbiddenResponse({ description: 'Only Admin have access ' }),
  )

export const PurchasePackage = () =>
  applyDecorators(ClientRole(), PurchasePackageSwaggerDefinition())

export const BillPackage = () =>
  applyDecorators(ClientRole(), BillPackageSwaggerDefinition())

export const CreatePackage = () =>
  applyDecorators(AdminRole(), CreatePackageSwaggerDefinition())

export const UpdatePackage = () =>
  applyDecorators(AdminRole(), UpdatePackageSwaggerDefinition())

export const GetPackages = () =>
  applyDecorators(Public(), GetPackagesSwaggerDefinition())
