import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserType } from '@prisma/client'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import { ROLES_KEY } from '../util/constants'

import RolesGuard from '../guards/role.guard'

const Roles = (...roles: UserType[]) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    // UseGuards(JwtAuthGuard, RolesGuard),
    UseGuards(RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  )

export default Roles
