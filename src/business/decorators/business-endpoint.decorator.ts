import { applyDecorators, UseInterceptors } from '@nestjs/common'
import {
  UpdateBusinessImageSwaggerDefinition,
  CreateBusinessSwaggerDefinition,
  UpdateBusinessSwaggerDefinition,
  AddBusinessServiceSwaggerDefinition,
  UpdateBusinessServiceImageSwaggerDefinition,
  UpdateBusinessServiceSwaggerDefinition,
  SearchBusinessSwaggerDefinition,
  GetBusinessSwaggerDefinition,
  GetBussinesDetailSwaggerDefinition,
  DeleteBusinessServiceSwaggerDefinition,
  CreateBusinessAddressSwaggerDefinition,
  UpdateBusinessAddressSwaggerDefinition,
  DeleteBusinessAddressSwaggerDefinition,
  UpdateBusinessContactSwaggerDefinition,
  AddStorySwaggerDefinition,
  DeleteStorySwaggerDefinition,
  GetAllStoriesSwaggerDefinition,
  GetBusinessStoriesSwaggerDefinition,
} from './business-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/helpers/multer.helper'
import { ApiForbiddenResponse } from '@nestjs/swagger'
import Public from 'src/common/decorators/public.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

const ClientRole = () =>
  applyDecorators(
    Permissions(),
    ApiForbiddenResponse({ description: 'Only owner can manupulate' }),
  )
export const CreateBusiness = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'CREATE' }),
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
    CreateBusinessSwaggerDefinition(),
  )

export const UpdateBusinessImage = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'UPDATE' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'business', filePrefix: 'b' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
    UpdateBusinessImageSwaggerDefinition(),
  )

export const UpdateBusiness = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'UPDATE' }),
    UpdateBusinessSwaggerDefinition(),
  )

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

export const UpdateBusinessServiceImage = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_SERVICE', action: 'UPDATE' }),
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
    UpdateBusinessServiceImageSwaggerDefinition(),
  )

export const GetBusinesses = () =>
  applyDecorators(Public(), GetBusinessSwaggerDefinition())

export const GetUserBusinesses = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    GetBusinessSwaggerDefinition(),
  )

export const GetBusinessDetail = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS', action: 'READ' }),
    GetBussinesDetailSwaggerDefinition(),
  )

export const SearchBusiness = () =>
  applyDecorators(Public(), SearchBusinessSwaggerDefinition())

// business address related

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

// bussiness contact

export const UpdateBusinessContact = () =>
  applyDecorators(
    Permissions({ model: 'BUSINESS_CONTACT', action: 'UPDATE' }),
    UpdateBusinessContactSwaggerDefinition(),
  )

// story related

export const AddStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'CREATE' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'story', filePrefix: 's' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddStorySwaggerDefinition(),
  )
export const UpdateStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'UPDATE' }),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'story', filePrefix: 's' }),
        fileFilter: multerFilter({
          fileType: 'image',
          maxSize: 5,
          optional: true,
        }),
      }),
    ),
    AddStorySwaggerDefinition(),
  )
export const DeleteStory = () =>
  applyDecorators(
    Permissions({ model: 'STORY', action: 'DELETE' }),
    DeleteStorySwaggerDefinition(),
  )

export const GetAllStories = () =>
  applyDecorators(Public(), GetAllStoriesSwaggerDefinition())

export const GetBusinessStories = () =>
  applyDecorators(Public(), GetBusinessStoriesSwaggerDefinition())
