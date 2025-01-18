import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PermisionSet, RequestWithUser } from 'src/common/types/base.type'
import { PERMISSIONS_KEY } from 'src/common/constants/base.constants'
import AccessControlService from '../access-control.service'

// Permission guard
@Injectable()
export default class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessControlService: AccessControlService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest()
    const requiredPermissions = this.reflector.getAllAndMerge<PermisionSet[]>(
      PERMISSIONS_KEY,
      [context.getClass(), context.getHandler()],
    )

    // If no permissions are required, grant access
    if (!requiredPermissions || requiredPermissions.length === 0) return true

    const { user } = request
    const allowedPermissions =
      await this.accessControlService.getUserPermissions({
        id: user.id,
      })
    // Check if the user has all the required permissions
    const hasPermission = requiredPermissions.every((requiredPermission) =>
      allowedPermissions.some(
        (allowedPermission) =>
          allowedPermission.moduleName === requiredPermission.model &&
          allowedPermission.permissionName === requiredPermission.action,
      ),
    )

    return hasPermission
  }
}
