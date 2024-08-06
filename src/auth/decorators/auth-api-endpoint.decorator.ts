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
import { Public } from 'src/common/decorators/public.decorator'

const ApiEndpointDecorator = (...optionalDecorators: Function[]) =>
  applyDecorators(...(optionalDecorators as any))

export const CreateAdminAccount = () =>
  ApiEndpointDecorator(Roles('SUPER_ADMIN'), CreateAdminSwaggerDefinition)

export const DeleteAdminAccount = () =>
  ApiEndpointDecorator(
    Roles('SUPER_ADMIN'),
    DeleteAdminAccountSwaggerDefinition,
  )
export const UpdateAdminStatus = () =>
  ApiEndpointDecorator(Roles('SUPER_ADMIN'), UpdateAdminStatusSwaggerDefinition)

export const GetAdmins = () =>
  ApiEndpointDecorator(Roles('SUPER_ADMIN'), GetAdminsSwaggerDefinition)

export const SignIn = () =>
  ApiEndpointDecorator(Public, SignInSwaggerDefinition)

export const CreateUserAccount = () =>
  ApiEndpointDecorator(Public, CreateUserAccountSwaggerDefinition)

export const UpdatePassword = () =>
  ApiEndpointDecorator(Public, UpdatePasswordSwaggerDefinition)

export const RequestOTP = () =>
  ApiEndpointDecorator(Public, RequestOTPSwaggerDefinition)

export const VerifyOTP = () =>
  ApiEndpointDecorator(Public, VerifyOTPSwaggerDefinition)

export const VerifyUser = () =>
  ApiEndpointDecorator(Public, VerifyUserSwaggerDefinition)
