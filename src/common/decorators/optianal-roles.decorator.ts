import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { UserType } from '@prisma/client'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { ROLES_KEY } from '../util/constants'
import RolesGuard from '../guards/role.guard'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import OptionalPublic from './optonal-public.decorator'

const RolesOptional = () =>
  applyDecorators(
    SetMetadata(ROLES_KEY, ['ADMIN', 'CLIENT_USER', 'SUPER_ADMIN']),
    OptionalPublic(),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
  )

export default RolesOptional
