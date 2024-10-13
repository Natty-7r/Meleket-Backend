import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger'
import AdminAccountResponse from '../responses/admin-account.response'

export const CreateAdminSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create admin account' }),
    ApiCreatedResponse({
      type: AdminAccountResponse,
      description: 'admin account created successfully',
    }),
    ApiConflictResponse({ description: 'Email is already in use!' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
}
export const UpdateAdminSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin status ' }),
    ApiResponse({
      type: String,
      description: 'Admin status updated successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
    ApiParam({ description: ' admin id ', name: 'id' }),
  )
}
export const UpdateAdminStatusSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update admin  ' }),
    ApiResponse({
      type: String,
      description: 'Admin  updated successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
    ApiParam({ description: ' admin id ', name: 'id' }),
  )
}
export const DeleteAdminSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete admin  ' }),
    ApiResponse({
      type: String,
      description: 'Admin  deleted successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
    ApiParam({ description: ' admin id ', name: 'id' }),
  )
}
export const GetadminDetailSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get admin detail ' }),
    ApiResponse({
      type: String,
      description: 'Admin  detail fetched successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
    ApiParam({ description: ' admin id ', name: 'id' }),
  )
}
export const GetAdminsSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all  admins ' }),
    ApiResponse({
      type: Array<AdminAccountResponse>,
      description: 'Admins fetched  successfully',
    }),
  )
}
