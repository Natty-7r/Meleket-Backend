import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import AuthService from './auth.service'
import AuthController from './auth.controller'
import LocalStrategy from './strategies/local.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config' // Import ConfigModule and ConfigService
import GoogleStrategy from './strategies/google.strategry'
import JwtStrategy from './strategies/jwt.strategry'

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule], // Import ConfigModule
      inject: [ConfigService], // Inject ConfigService
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'), // Use ConfigService to get JWT secret
        signOptions: { expiresIn: configService.get<string>('jwt.expiresIn') },
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
