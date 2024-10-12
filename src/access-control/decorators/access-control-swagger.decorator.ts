// Swagger definitions for AccessControl Controller

import { applyDecorators } from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiParam,
  ApiCreatedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger'
import PermissionResponse from '../responses/permission.reponse'
import RoleResponse from '../responses/role.response'
import AdminResponse from '../responses/admin.response'

export const GetPermissionsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all permissions' }),
    ApiResponse({
      description: 'Permissions fetched successfully',
      type: [PermissionResponse],
    }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetRolePermissionsSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all permissions' }),
    ApiResponse({
      description: 'Permissions fetched successfully',
      type: [PermissionResponse],
    }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'Role ID', required: true }),
  )

export const GetRolesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all roles' }),
    ApiResponse({
      description: 'Roles fetched successfully',
      type: [RoleResponse],
    }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
export const GetRoleDetailSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get Role  detail' }),
    ApiResponse({
      description: 'Role detail fetched successfully',
      type: [RoleResponse],
    }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const GetPermissionsByRoleIdSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get Role Permissions ' }),
    ApiResponse({
      description: 'Permissions fetched successfully for the role',
      type: [PermissionResponse],
    }),
    ApiBadRequestResponse({ description: 'Invalid role ID' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'Role ID', required: true }),
  )

export const CreateRoleSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new role' }),
    ApiCreatedResponse({
      description: 'Role created successfully',
      type: RoleResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid data for creating role' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const UpdateRoleSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update  role' }),
    ApiResponse({
      description: 'Role updated successfully',
      type: RoleResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid role ID or data' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'Role ID', required: true }),
  )

export const DeleteRoleSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete a role' }),
    ApiResponse({ description: 'Role deleted successfully' }),
    ApiBadRequestResponse({ description: 'Invalid role ID' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'Role ID', required: true }),
  )

export const AssignAdminRoleSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Assign admin role to a user' }),
    ApiResponse({
      description: 'Admin role assigned successfully',
      type: AdminResponse,
    }),
    ApiBadRequestResponse({ description: 'Invalid role assignment data' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )

export const RevokeAdminRoleSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Revoke admin role from a user' }),
    ApiResponse({ description: 'Admin role revoked successfully' }),
    ApiBadRequestResponse({ description: 'Invalid user ID' }),
    ApiForbiddenResponse({ description: 'Not authorized' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
    ApiParam({ name: 'id', description: 'User ID', required: true }),
  )
