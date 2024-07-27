import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestWithUser } from 'src/common/util/types'
import { User } from '@prisma/client'
import { Request as RequestType } from 'express'
import { AuthGuard } from '@nestjs/passport'
import AuthService from './auth.service'
import { CreateAccountDto, SignInDto } from './dto'
import LocalAuthGuard from './guards/local-auth.guard'
import GoogleOAuthGuard from './guards/google-auth.guard'
import CreateAccountSwaggerDefinition from './decorators/swagger/create-account.swagger.dto'
import SignInSwaggerDefinition from './decorators/swagger/sign-in.swagger.dto'

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @CreateAccountSwaggerDefinition()
  @Post('/create-account')
  createAccount(@Body() creaeteAccountDto: CreateAccountDto) {
    return this.authService.createAccount(creaeteAccountDto)
  }

  @SignInSwaggerDefinition()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Request() req: RequestWithUser) {
    return this.authService.login(req.user as User)
  }

  @Get('google-auth')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req: RequestType) {
    return 'google auth trying '
  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req: RequestType) {
    console.log(req)
    // return this.authService.googleLogin(req)
  }
}
