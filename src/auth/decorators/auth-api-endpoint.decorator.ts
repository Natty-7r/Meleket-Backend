import { applyDecorators } from '@nestjs/common'
import {
  CreateUserAccountSwaggerDefinition,
  RequestOTPSwaggerDefinition,
  SignInSwaggerDefinition,
  UpdatePasswordSwaggerDefinition,
  VerifyOTPSwaggerDefinition,
  VerifyUserSwaggerDefinition,
} from './auth-swagger-definition.decorator'
import Public from 'src/common/decorators/public.decorator'

export const CreateUserAccount = () =>
  applyDecorators(Public(), CreateUserAccountSwaggerDefinition())

export const SignIn = () => applyDecorators(Public(), SignInSwaggerDefinition())

export const UpdatePassword = () =>
  applyDecorators(Public(), UpdatePasswordSwaggerDefinition())

export const RequestOTP = () =>
  applyDecorators(Public(), RequestOTPSwaggerDefinition())

export const VerifyOTP = () =>
  applyDecorators(Public(), VerifyOTPSwaggerDefinition())

export const VerifyUser = () =>
  applyDecorators(Public(), VerifyUserSwaggerDefinition())
