import { applyDecorators } from '@nestjs/common'
import {
  CreateAdminSwaggerDefinition,
  CreateUserAccountSwaggerDefinition,
  DeleteAdminAccountSwaggerDefinition,
  GetAdminsSwaggerDefinition,
  RequestOTPSwaggerDefinition,
  SignInSwaggerDefinition,
  UpdateAdminStatusSwaggerDefinition,
  UpdatePasswordSwaggerDefinition,
  VerifyOTPSwaggerDefinition,
  VerifyUserSwaggerDefinition,
} from './auth-swagger-definition.decorator'
import Public from 'src/common/decorators/public.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

export const CreateUserAccount = () =>
  applyDecorators(Public(), CreateUserAccountSwaggerDefinition())

export const CreateAdminAccount = () =>
  applyDecorators(Permissions(), CreateAdminSwaggerDefinition())

export const DeleteAdminAccount = () =>
  applyDecorators(Permissions(), DeleteAdminAccountSwaggerDefinition)
export const UpdateAdminStatus = () =>
  applyDecorators(Permissions(), UpdateAdminStatusSwaggerDefinition())

export const GetAdmins = () =>
  applyDecorators(Permissions(), GetAdminsSwaggerDefinition())

export const SignIn = () => applyDecorators(Public(), SignInSwaggerDefinition())

export const UpdatePassword = () =>
  applyDecorators(Public(), UpdatePasswordSwaggerDefinition())

export const RequestOTP = () =>
  applyDecorators(Public(), RequestOTPSwaggerDefinition())

export const VerifyOTP = () =>
  applyDecorators(Public(), VerifyOTPSwaggerDefinition())

export const VerifyUser = () =>
  applyDecorators(Public(), VerifyUserSwaggerDefinition())
