import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiGoneResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import SignInResponse from 'src/auth/responses/sign-in.response'
import CreateAccountResponse from '../responses/create-account.response'
import CreateOTPDto from '../dto/create-otp.dto'
import UpdatePasswordDto from '../dto/update-passowrd.dto'

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

export const CreateAccountSwaggerDefinition = () => {
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

export const RequestOTPSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Request OTP ' }),
    ApiCreatedResponse({
      type: CreateOTPDto,
      description: 'OTP created successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid email or phone number' }),
    ApiConflictResponse({ description: 'User is already verified' }),
  )
}

export const VerifyOTPSwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ summary: 'verifiy OTP ' }),
    ApiCreatedResponse({
      type: CreateOTPDto,
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
    ApiCreatedResponse({
      type: CreateOTPDto,
      description: 'iser verified successfully',
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
    ApiCreatedResponse({
      type: UpdatePasswordDto,
      description: 'password verified successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid user id ' }),
    ApiNotFoundResponse({ description: 'OTP not found' }),
    ApiBadRequestResponse({ description: 'Invalid OTP' }),
    ApiGoneResponse({ description: 'OTP expired' }),
  )
}
