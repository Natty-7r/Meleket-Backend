import { ModuleName, PermissionType } from '@prisma/client'

export const NULL_ROLE_NAME: string = 'NULL_ROLE_NAME' // when admin is revoked

export const USER_ROLE_NAME = 'USER_ROLE'

export const APPLICANT_PROBATION_PERIOD: number = 2 // number of probation date for applicant

export const PERMISSION_TYPES: Set<PermissionType> = new Set([
  'CREATE',
  'UPDATE',
  'DELETE',
  'READ',
  'CREATE',
])
export const MODULE_LIST: Set<ModuleName> = new Set([
  'ROLE',
  'PERMISSION',
  'APPLICANT',
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

export const USER_PERMISSION_SELECTOR: any = {
  OR: [
    {
      AND: [{ moduleName: 'JOB' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'COMPANY' }, { permissionName: 'READ' }],
    },
    {
      moduleName: 'APPLICANT',
    },
  ],
}

export const ADMIN_PERMISSION_SELECTOR: any = {
  OR: [
    {
      AND: [{ moduleName: 'PERMISSION' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'APPLICANT' }, { permissionName: 'READ' }],
    },
    {
      AND: [{ moduleName: 'APPLICANT' }, { permissionName: 'UPDATE' }],
    },
    {
      OR: [
        { moduleName: 'JOB' },
        { moduleName: 'COMPANY' },
        { moduleName: 'ROLE' },
        { moduleName: 'ADMIN' },
      ],
    },
  ],
}
