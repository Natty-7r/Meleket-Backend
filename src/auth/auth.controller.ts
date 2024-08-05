import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestWithUser, SignUpType } from 'src/common/util/types'
import { User } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import AuthService from './auth.service'
import { CreateAccountDto } from './dto'
import LocalAuthGuard from './guards/local-auth.guard'
import GoogleOAuthGuard from './guards/google-auth.guard'
import {
  CreateAccountSwaggerDefinition,
  SignInSwaggerDefinition,
} from './decorators/auth-swagger-definition.decorator'

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @CreateAccountSwaggerDefinition()
  @Post('/create-account')
  createAccount(@Body() creaeteAccountDto: CreateAccountDto) {
    return this.authService.createAccount(
      creaeteAccountDto,
      SignUpType.BY_EMAIL,
    )
  }

  @SignInSwaggerDefinition()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user as User)
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return 'google auth trying '
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect() {
    // return this.authService.googleLogin(req)
  }
}
