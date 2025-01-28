import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config' // Import ConfigModule and ConfigService
import MessageModule from 'src/message/message.module'
import AdminModule from 'src/admin/admin.module'
import UserModule from 'src/user/user.module'
import AuthService from './auth.service'
import AuthController from './auth.controller'
import LocalStrategy from './strategies/local.strategy'
import JwtStrategy from './strategies/jwt.strategry'
import { GoogleStrategy } from './strategies/google.strategry'

@Module({
  imports: [
    ConfigModule.forRoot(), // Ensure ConfigModule is imported
    // JwtModule.registerAsync({
    //   imports: [ConfigModule], // Ensure ConfigModule is imported here
    //   inject: [ConfigService], // Inject ConfigService
    //   useFactory: (configService: ConfigService) => ({
    //     global: true, // Make the module global
    //     secret: configService.get<string>('JWT_SECRETE'), // Use ConfigService for the JWT secret
    //     signOptions: {
    //       expiresIn: configService.get<string>('JWT_EXPIRES_IN'), // Use ConfigService for expiresIn
    //     },
    //   }),
    // }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
    MessageModule,
    AdminModule,
    UserModule,
  ],
  providers: [AuthService, LocalStrategy, GoogleStrategy, JwtStrategy],
  controllers: [AuthController],
})
export default class AuthModule {}
