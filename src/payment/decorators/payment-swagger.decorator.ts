import { applyDecorators, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'
import BusinessPackageResponse from '../responses/business-package.response'
import PackageResponse from '../responses/package.response copy'

// package related

export const CreatePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Create package ' }),
    ApiCreatedResponse({
      description: 'Package created  successfully',
      type: PackageResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const UpdatePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Update package ' }),
    ApiCreatedResponse({
      description: 'Package updated  successfully',
      type: PackageResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetPackagesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Get packages ' }),
    ApiCreatedResponse({
      description: 'Packages fetched  successfully',
      type: Array<PackageResponse>,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const PurchasePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ description: 'Purchase package ' }),
    ApiCreatedResponse({
      description: 'package purchased  successfully',
      type: BusinessPackageResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid Package or Business Id ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
