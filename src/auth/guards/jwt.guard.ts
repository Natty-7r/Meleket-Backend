import { ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import {
  IS_OPTIONAL_PUBLIC_KEY,
  IS_PUBLIC_KEY,
} from 'src/common/constants/base.constants'

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private readonly a: JwtService,
  ) {
    super()
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Promise<boolean> {
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
        return super.canActivate(context) as any
      } catch (error) {
        return true
      }
    }
    return (await super.canActivate(context)) as any
  }
}
