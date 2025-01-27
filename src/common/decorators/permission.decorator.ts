import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'

import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { PERMISSIONS_KEY } from 'src/common/constants/base.constants'
import JwtAuthGuard from '../../auth/guards/jwt.guard'
import PermissionGuard from 'src/access-control/guard/permission.guard'
import { PermisionSet } from '../types/base.type'

const Permissions = (...permissions: PermisionSet[]) =>
  applyDecorators(
    SetMetadata(PERMISSIONS_KEY, permissions),
    // UseGuards(JwtAuthGuard, PermissionGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'not allowed' }),
  )

export default Permissions
