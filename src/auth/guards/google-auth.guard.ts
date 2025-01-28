import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export default class GoogleOAuthGuard extends AuthGuard('google') {
  // constructor() {
  //   super({ accessType: 'offline' })
  // }
  // async canActivate(context: ExecutionContext): Promise<boolean> {
  //   const request = context.switchToHttp().getRequest()
  //   const activate = (await super.canActivate(context)) as boolean
  //   await super.logIn(request)
  //   return activate
  // }
}
