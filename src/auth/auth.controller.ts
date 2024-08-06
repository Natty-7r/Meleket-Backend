import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Put,
} from '@nestjs/common'
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
  RequestOTPSwaggerDefinition,
  SignInSwaggerDefinition,
  UpdatePasswordSwaggerDefinition,
  VerifyOTPSwaggerDefinition,
  VerifyUserSwaggerDefinition,
} from './decorators/auth-swagger-definition.decorator'
import VerifyUserDto from './dto/verify-user.dto'
import VerifyOTPDto from './dto/verify-otp.dto'
import CreateOTPDto from './dto/create-otp.dto'
import { Public } from 'src/common/decorators/public.decorator'
import UpdatePasswordDto from './dto/update-passowrd.dto'

@ApiTags('Auth')
@Public()
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
  @RequestOTPSwaggerDefinition()
  @Post('request-otp')
  requestOTP(@Body() createOTPDto: CreateOTPDto) {
    return this.authService.requestOTP(createOTPDto)
  }

  @VerifyOTPSwaggerDefinition()
  @Put('verify-otp')
  verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
    return this.authService.verifyOTP(verifyOTPDto)
  }

  @VerifyUserSwaggerDefinition()
  @Put('verify-user')
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto)
  }
  @UpdatePasswordSwaggerDefinition()
  @Put('update-user-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto)
  }
}
