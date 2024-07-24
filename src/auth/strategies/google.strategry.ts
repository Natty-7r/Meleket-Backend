import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { VerifyCallback } from 'passport-google-oauth20'
import { Strategy } from 'passport-local'

@Injectable()
export default class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google',
) {
  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get('GOOGLE_CLIENT_ID')
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRETE')
    const callbackURL = configService.get('GOOGLE_REDIRECT_URL')

    console.log(callbackURL, clientID, clientSecret)
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/google-redirect',
      scope: ['email', 'profile'],
    })
    // super({
    //   clientID,
    //   clientSecret,
    //   callbackURL,
    //   scope: ['email', 'profile'],
    // })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile

    console.log(profile)
    const user = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    }

    done(null, user)
  }
}
