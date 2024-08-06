import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import SignInResponse from 'src/auth/responses/sign-in.response'
import CreateAccountResponse from '../responses/create-account.response'
import CreateAdminAccountResponse from '../responses/create-admin.response '

export const SignInSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'User Login  ' }),
    ApiCreatedResponse({
      type: SignInResponse,
      description: 'User Logged in successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid Email or Password' }),
    ApiNotFoundResponse({
      description: 'No user is registered with this email',
    }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
}

export const CreateUserAccountSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create user account' }),
    ApiCreatedResponse({
      type: CreateAccountResponse,
      description: 'user account created successfully',
    }),
    ApiConflictResponse({ description: 'Email is already in use!' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
}
export const CreateAdminSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create admin account' }),
    ApiCreatedResponse({
      type: CreateAdminAccountResponse,
      description: 'admin account created successfully',
    }),
    ApiConflictResponse({ description: 'Email is already in use!' }),
    ApiInternalServerErrorResponse({ description: 'Something went wrong' }),
  )
}

export const RequestOTPSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Request OTP ' }),
    ApiResponse({
      type: String,
      description: 'OTP created successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid email or phone number' }),
    ApiConflictResponse({ description: 'User is already verified' }),
  )
}

export const VerifyOTPSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'verifiy OTP ' }),
    ApiResponse({
      type: String,
      description: 'OTP verified successfully',
    }),
    ApiNotFoundResponse({ description: 'OTP not found' }),
    ApiBadRequestResponse({ description: 'Invalid OTP' }),
    ApiGoneResponse({ description: 'OTP expired' }),
  )
}

export const VerifyUserSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'verifiy user ' }),
    ApiResponse({
      type: String,
      description: 'user verified successfully',
    }),
    ApiNotFoundResponse({ description: 'OTP not found' }),
    ApiBadRequestResponse({ description: 'Invalid email' }),
    ApiBadRequestResponse({ description: 'Invalid OTP' }),
    ApiGoneResponse({ description: 'OTP expired' }),
  )
}

export const UpdatePasswordSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'update password user ' }),
    ApiResponse({
      type: String,
      description: 'password verified successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid user id ' }),
    ApiNotFoundResponse({ description: 'OTP not found' }),
    ApiBadRequestResponse({ description: 'Invalid OTP' }),
    ApiGoneResponse({ description: 'OTP expired' }),
  )
}
export const UpdateAdminStatusSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'update admin status ' }),
    ApiResponse({
      type: String,
      description: 'Admin status updated successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
  )
}
export const GetAdminsSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'get all  admins ' }),
    ApiResponse({
      type: Array<CreateAdminAccountResponse>,
      description: 'Admins fetched  successfully',
    }),
  )
}
export const DeleteAdminAccountSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'update admin status ' }),
    ApiResponse({
      type: String,
      description: 'Admin status updated successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid admin id ' }),
  )
}
