import { applyDecorators } from '@nestjs/common'
import {
  BillPackageSwaggerDefinition,
  CreatePackageSwaggerDefinition,
  GetPackagesSwaggerDefinition,
  PurchasePackageSwaggerDefinition,
  UpdatePackageSwaggerDefinition,
} from './payment-swagger.decorator'
import Permissions from 'src/common/decorators/permission.decorator'
import Public from 'src/common/decorators/public.decorator'

export const PurchasePackage = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_PACKAGE', action: 'CREATE' }),
    PurchasePackageSwaggerDefinition(),
  )

export const BillPackage = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_PACKAGE', action: 'UPDATE' }),
    BillPackageSwaggerDefinition(),
  )

export const CreatePackage = () =>
  applyDecorators(
    Permissions({ model: 'PACKAGE', action: 'CREATE' }),
    CreatePackageSwaggerDefinition(),
  )

export const UpdatePackage = () =>
  applyDecorators(
    Permissions({ model: 'PACKAGE', action: 'UPDATE' }),
    UpdatePackageSwaggerDefinition(),
  )

export const GetPackages = () =>
  applyDecorators(Public(), GetPackagesSwaggerDefinition())
