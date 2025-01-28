import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateAdminAccount } from 'src/admin/decorators/admin-api.decorator'
import CreateAdminDto from 'src/admin/dto/create-admin-account.dto'
import User from 'src/common/decorators/user.decorator'
import { RequestUser, RequestWithUser } from 'src/common/types/base.type'
import AuthService from './auth.service'
import {
  CreateAccountDto,
  CreateOTPDto,
  SignInDto,
  UpdatePasswordDto,
  VerifyOTPDto,
} from './dto'
import GoogleOAuthGuard from './guards/google-auth.guard'
import LocalAuthGuard from './guards/local-auth.guard'

import { AuthProvider } from '@prisma/client'
import {
  CreateUserAccount,
  RequestOTP,
  SignIn,
  UpdateAuthProvider,
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
    return this.authService.createUserAccount({
      ...createAccountDto,
      authProvider: AuthProvider.LOCAL,
    })
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
  async login(@Body() _: SignInDto, @Request() req: RequestWithUser) {
    return this.authService.login(req.user)
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: RequestWithUser) {
    return this.authService.login(req.user)
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
  @UpdateAuthProvider()
  @Patch('/provider')
  updateAuthProvider(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto)
  }
}
