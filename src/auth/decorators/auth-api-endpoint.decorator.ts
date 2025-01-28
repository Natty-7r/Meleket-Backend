import { applyDecorators, UseGuards } from '@nestjs/common'
import {
  CreateUserAccountSwaggerDefinition,
  RequestOTPSwaggerDefinition,
  SignInSwaggerDefinition,
  UpdateAuthProviderSwaggerDefinition,
  UpdatePasswordSwaggerDefinition,
  VerifyOTPSwaggerDefinition,
  VerifyUserSwaggerDefinition,
} from './auth-swagger-definition.decorator'
import Public from 'src/common/decorators/public.decorator'
import JwtAuthGuard from '../guards/jwt.guard'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'

export const CreateUserAccount = () =>
  applyDecorators(Public(), CreateUserAccountSwaggerDefinition())

export const SignIn = () => applyDecorators(Public(), SignInSwaggerDefinition())

export const UpdatePassword = () =>
  applyDecorators(Public(), UpdatePasswordSwaggerDefinition())

export const UpdateAuthProvider = () =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    UpdateAuthProviderSwaggerDefinition(),
  )

export const RequestOTP = () =>
  applyDecorators(Public(), RequestOTPSwaggerDefinition())

export const VerifyOTP = () =>
  applyDecorators(Public(), VerifyOTPSwaggerDefinition())

export const VerifyUser = () =>
  applyDecorators(Public(), VerifyUserSwaggerDefinition())
