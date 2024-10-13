// Api Decorator  definitions for AccessControlController

import { applyDecorators } from '@nestjs/common'
import Permissions from 'src/common/decorators/permission.decorator'
import {
  AssignAdminRoleSwaggerDefinition,
  CreateRoleSwaggerDefinition,
  DeleteRoleSwaggerDefinition,
  GetPermissionsSwaggerDefinition,
  GetRoleDetailSwaggerDefinition,
  GetRolePermissionsSwaggerDefinition,
  GetRolesSwaggerDefinition,
  RevokeAdminRoleSwaggerDefinition,
  UpdateRoleSwaggerDefinition,
} from './access-control-swagger.decorator'

export const GetPermissions = () =>
  applyDecorators(
    Permissions({ action: 'READ', model: 'PERMISSION' }),
    GetPermissionsSwaggerDefinition(),
  )
export const GetRolePermissions = () =>
  applyDecorators(
    Permissions({ action: 'READ', model: 'PERMISSION' }),
    GetRolePermissionsSwaggerDefinition(),
  )
export const GetRoles = () =>
  applyDecorators(
    Permissions({ action: 'READ', model: 'ROLE' }),
    GetRolesSwaggerDefinition(),
  )
export const GetRoleDetail = () =>
  applyDecorators(
    Permissions({ action: 'READ', model: 'PERMISSION' }),
    GetRoleDetailSwaggerDefinition(),
  )
export const CreateRole = () =>
  applyDecorators(
    Permissions({ action: 'CREATE', model: 'ROLE' }),
    CreateRoleSwaggerDefinition(),
  )
export const UpdateRole = () =>
  applyDecorators(
    Permissions({ action: 'UPDATE', model: 'ROLE' }),
    UpdateRoleSwaggerDefinition(),
  )
export const DeleteRole = () =>
  applyDecorators(
    Permissions({ action: 'DELETE', model: 'ROLE' }),
    DeleteRoleSwaggerDefinition(),
  )
export const AssignAdminRole = () =>
  applyDecorators(
    Permissions(
      { action: 'UPDATE', model: 'ADMIN' },
      { action: 'UPDATE', model: 'ROLE' },
    ),
    AssignAdminRoleSwaggerDefinition(),
  )
export const RevokeRole = () =>
  applyDecorators(
    Permissions(
      { action: 'UPDATE', model: 'ADMIN' },
      { action: 'UPDATE', model: 'ROLE' },
    ),
    RevokeAdminRoleSwaggerDefinition(),
  )
