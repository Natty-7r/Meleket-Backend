// src/auth/strategies/google.strategy.ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { AuthProvider, User } from '@prisma/client'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { DEFAULE_O_AUTH_PASSWORD } from 'src/common/constants/base.constants'
import AuthService from '../auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile
    const userData = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
    }

    let { user } = await this.authService.checkEmail({
      email: userData.email,
    })
    if (!user) {
      user = (await this.authService.createUserAccount({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: DEFAULE_O_AUTH_PASSWORD,
        authProvider: AuthProvider.GOOGLE,
      })) as User
    }
    done(null, user)
  }
}
