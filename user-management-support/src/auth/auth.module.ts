import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import AuthService from './auth.service'
import AuthController from './auth.controller'
import LocalStrategy from './strategies/local.strategy'
import GoogleStrategy from './strategies/google.strategry'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
