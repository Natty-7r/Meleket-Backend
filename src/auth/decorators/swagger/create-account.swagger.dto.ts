import { applyDecorators } from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateAccountResponse from 'src/auth/responses/create-account.response'

const CreateAccountSwaggerDefinition = () => {
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

export default CreateAccountSwaggerDefinition
