import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { RequestWithUser } from 'src/common/util/types'
import { User } from '@prisma/client'
import AuthService from './auth.service'
import { CreateAccountDto, SignInDto } from './dto'
import LocalAuthGuard from './guards/local-auth.guard'
import GoogleOAuthGuard from './guards/google-auth.guard'
import { Request as RequestType } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/create-account')
  @ApiOperation({ summary: 'Create user account' })
  @ApiCreatedResponse({
    type: CreateAccountDto,
    description: 'user account created successfully',
  })
  @ApiConflictResponse({ description: 'Email is already in use!' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  createAccount(@Body() creaeteAccountDto: CreateAccountDto) {
    return this.authService.createAccount(creaeteAccountDto)
  }

  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  @ApiOperation({ summary: 'User Login  ' })
  @ApiCreatedResponse({
    type: SignInDto,
    description: 'User Logged in successfully',
  })
  @ApiBadRequestResponse({ description: 'Invalid Email or Password' })
  @ApiNotFoundResponse({ description: 'No user is registered with this email' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
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
