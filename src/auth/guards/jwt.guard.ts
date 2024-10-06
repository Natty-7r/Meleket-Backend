import { Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY, IS_OPTIONAL_PUBLIC_KEY } from 'src/common/constants'

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true
    const isOptionalPublic = this.reflector.getAllAndOverride<boolean>(
      IS_OPTIONAL_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (isOptionalPublic) {
      try {
        return super.canActivate(context)
      } catch (error) {
        return true
      }
    }
    return super.canActivate(context)
  }
}
