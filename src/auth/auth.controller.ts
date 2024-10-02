import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Put,
  Param,
  Delete,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestWithUser, SignUpType } from 'src/common/types/base.type'
import { User } from '@prisma/client'
import { AuthGuard } from '@nestjs/passport'
import AuthService from './auth.service'
import LocalAuthGuard from './guards/local-auth.guard'
import GoogleOAuthGuard from './guards/google-auth.guard'
import {
  VerifyOTPDto,
  CreateOTPDto,
  CreateAccountDto,
  UpdatePasswordDto,
  CreateAdminDto,
  UpdateAdminStatusDto,
  SignInDto,
} from './dto'

import {
  CreateAdminAccount,
  CreateUserAccount,
  DeleteAdminAccount,
  GetAdmins,
  RequestOTP,
  SignIn,
  UpdateAdminStatus,
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
  createAdminAccount(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdminAccount(createAdminDto)
  }

  @SignIn()
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  async login(@Body() signInDto: SignInDto, @Request() req: RequestWithUser) {
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

  @GetAdmins()
  @Get('/admins')
  getAdmins() {
    return this.authService.getAdmins()
  }

  @UpdateAdminStatus()
  @Put('/admins/status')
  updateAdminStatus(@Body() updateAdminStatusDto: UpdateAdminStatusDto) {
    return this.authService.updateAdminStatus(updateAdminStatusDto)
  }

  @DeleteAdminAccount()
  @Delete('/admins/:id')
  deleteAdminAccount(@Param('id') id: string) {
    return this.authService.deleteAdminAccount({ id })
  }
}
