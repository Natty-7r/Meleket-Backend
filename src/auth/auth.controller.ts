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
import {
  RequestUser,
  RequestWithUser,
  SignUpType,
} from 'src/common/types/base.type'
import { AuthGuard } from '@nestjs/passport'
import { CreateAdminAccount } from 'src/admin/decorators/admin-api.decorator'
import CreateAdminDto from 'src/admin/dto/create-admin-account.dto'
import User from 'src/common/decorators/user.decorator'
import AuthService from './auth.service'
import LocalAuthGuard from './guards/local-auth.guard'
import GoogleOAuthGuard from './guards/google-auth.guard'
import {
  VerifyOTPDto,
  CreateOTPDto,
  CreateAccountDto,
  UpdatePasswordDto,
  SignInDto,
} from './dto'

import {
  CreateUserAccount,
  RequestOTP,
  SignIn,
  UpdatePassword,
  VerifyOTP,
  VerifyUser,
} from './decorators/auth-api-endpoint.decorator'
import VerifyAccountDto from './dto/verify-user.dto'

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @CreateUserAccount()
  @Post('/user-accounts')
  createUserAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.authService.createUserAccount(
      createAccountDto,
      SignUpType.BY_EMAIL,
    )
  }

  @CreateAdminAccount()
  @Post('/admin-accounts')
  createAdminAccount(
    @Body() createAdminDto: CreateAdminDto,
    @User() admin: RequestUser,
  ) {
    return this.authService.createAdminAccount({
      ...createAdminDto,
      adminId: admin.id,
    })
  }

  @SignIn()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Body() signInDto: SignInDto, @Request() req: RequestWithUser) {
    return this.authService.login(req.user)
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

  @RequestOTP()
  @Post('/otp')
  requestOTP(@Body() createOTPDto: CreateOTPDto) {
    return this.authService.requestOTP(createOTPDto)
  }

  @VerifyOTP()
  @Put('/otp')
  verifyOTP(@Body() verifyOTPDto: VerifyOTPDto) {
    return this.authService.verifyOTP(verifyOTPDto)
  }

  @VerifyUser()
  @Put('/accounts')
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto)
  }

  @UpdatePassword()
  @Put('/password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto)
  }
}
