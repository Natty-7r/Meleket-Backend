import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from '@prisma/client'
import AuthService from '../auth.service'

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<any> {
    const user: User = await this.authService.validateUser({ email, password })
    if (!user) {
      throw new UnauthorizedException('Invalid Email or Passoword')
    }
    return user
  }
}
