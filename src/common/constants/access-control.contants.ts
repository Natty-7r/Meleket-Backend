import { ModuleName, PermissionType, Prisma } from '@prisma/client'

export const NULL_ROLE_NAME: string = 'NULL_ROLE' // when admin is revoked

export const USER_ROLE_NAME = 'USER_ROLE'

export const CLIENT_ROLE_NAME = 'CLIENT_ROLE'

// Define the permission types
export const PERMISSION_TYPES: Set<PermissionType> = new Set([
  'CREATE',
  'UPDATE',
  'DELETE',
  'READ',
])

// Define the module list
export const MODULE_LIST: Set<ModuleName> = new Set([
  'ROLE',
  'PERMISSION',
  'ADMIN',
  'USER',
  'PROFILE',
  'BUSINESS',
  'BUSINESS_SERVICE',
  'BUSINESS_ADDRESS',
  'BUSINESS_CONTACT',
  'CATEGORY',
  'BILL',
  'PACKAGE',
  'BUSINESS_PACKAGE',
  'STORY',
  'STORY_VIEW',
  'REVIEW',
  'RATING',
  'OTP',
  'LOG',
])

// USER (Regular User) Permissions Selector
export const USER_PERMISSION_SELECTOR: Prisma.PermissionWhereInput = {
  OR: [
    {
      AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'CREATE' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS_SERVICE' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS_CONTACT' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'STORY' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'CATEGORY' }, { permissionName: 'READ' }],
    },
    // Can read other business-related entities...
  ],
}

// CLIENT (Business Owner) Permissions Selector
export const CLIENT_PERMISSION_SELECTOR: Prisma.PermissionWhereInput = {
  OR: [
    {
      AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'CREATE' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'UPDATE' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS_SERVICE' }, { permissionName: 'CREATE' }],
    },
    {
      AND: [{ moduleName: 'BUSINESS_SERVICE' }, { permissionName: 'UPDATE' }],
    },
    {
      AND: [{ moduleName: 'STORY' }, { permissionName: 'CREATE' }],
    },
    {
      AND: [{ moduleName: 'STORY' }, { permissionName: 'UPDATE' }],
    },
    {
      AND: [{ moduleName: 'STORY' }, { permissionName: 'DELETE' }],
    },
    {
      AND: [{ moduleName: 'CATEGORY' }, { permissionName: 'CREATE' }],
    },
    {
      AND: [{ moduleName: 'CATEGORY' }, { permissionName: 'UPDATE' }],
    },
    {
      AND: [{ moduleName: 'BILL' }, { permissionName: 'READ' }],
    },

    // Restriction: Cannot delete categories
    // Cannot access roles, permissions, or logs
  ],
}

// ADMIN Permissions Selector
export const SUPER_ADMIN_PERMISSION_SELECTOR: Prisma.PermissionWhereInput = {
  OR: [
    {
      AND: [{ moduleName: 'PERMISSION' }, { permissionName: 'READ' }],
    },
    { moduleName: 'ROLE' },
    {
      AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'UPDATE' }],
    },
    {
      AND: [{ moduleName: 'USER' }, { permissionName: 'UPDATE' }],
    },
    {
      moduleName: 'CATEGORY',
    },
    {
      moduleName: 'PACKAGE',
    },
    {
      moduleName: 'ADMIN',
    },
    {
      AND: [{ moduleName: 'BILL' }, { permissionName: 'DELETE' }],
    },
  ],
}
