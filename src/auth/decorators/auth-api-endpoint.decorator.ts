import { applyDecorators } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
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

export const CreateAdminAccount = () =>
  applyDecorators(Roles('SUPER_ADMIN'), CreateAdminSwaggerDefinition())

export const DeleteAdminAccount = () =>
  applyDecorators(Roles('SUPER_ADMIN'), DeleteAdminAccountSwaggerDefinition)
export const UpdateAdminStatus = () =>
  applyDecorators(Roles('SUPER_ADMIN'), UpdateAdminStatusSwaggerDefinition())

export const GetAdmins = () =>
  applyDecorators(Roles('SUPER_ADMIN'), GetAdminsSwaggerDefinition())

export const SignIn = () => applyDecorators(Public(), SignInSwaggerDefinition())

export const CreateUserAccount = () =>
  applyDecorators(Public(), CreateUserAccountSwaggerDefinition())

export const UpdatePassword = () =>
  applyDecorators(Public(), UpdatePasswordSwaggerDefinition())

export const RequestOTP = () =>
  applyDecorators(Public(), RequestOTPSwaggerDefinition())

export const VerifyOTP = () =>
  applyDecorators(Public(), VerifyOTPSwaggerDefinition())

export const VerifyUser = () =>
  applyDecorators(Public(), VerifyUserSwaggerDefinition())
