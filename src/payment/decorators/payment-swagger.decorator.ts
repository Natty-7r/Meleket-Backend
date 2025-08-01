import { applyDecorators, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'
import BusinessPackageResponse from '../responses/business-package.response'
import PackageResponse from '../responses/package.response copy'

// package related

export const CreatePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create package ' }),
    ApiCreatedResponse({
      description: 'Package created  successfully',
      type: PackageResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const UpdatePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update package ' }),
    ApiCreatedResponse({
      description: 'Package updated  successfully',
      type: PackageResponse,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetPackagesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get packages ' }),
    ApiCreatedResponse({
      description: 'Packages fetched  successfully',
      type: Array<PackageResponse>,
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const PurchasePackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Purchase package ' }),
    ApiCreatedResponse({
      description: 'package purchased  successfully',
      type: BusinessPackageResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid Package or Business Id ' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const BillPackageSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Bill  package ' }),
    ApiCreatedResponse({
      description: 'package billed  successfully',
      type: BusinessPackageResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid Package or Business Id ' }),
    ApiConflictResponse({ description: 'Package aleardy billed' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
