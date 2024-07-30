import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import SignInResponse from 'src/auth/responses/sign-in.response'
import CreateAccountResponse from '../responses/create-account.response'

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
