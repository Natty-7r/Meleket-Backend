import { Module } from '@nestjs/common'
import { JwtStrategy } from './strategies/jwt.strategry'

@Module({ providers: [JwtStrategy], exports: [JwtStrategy] })
export default class AuthModule {}
