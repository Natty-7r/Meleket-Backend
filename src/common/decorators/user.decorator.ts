import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser } from '../util/types/base.type'

// decorator to extract user from request
const User = createParamDecorator((data: string, context: ExecutionContext) => {
  const { user }: RequestWithUser = context.switchToHttp().getRequest()

  return data ? user[data] : user
})
export default User
