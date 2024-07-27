import { applyDecorators } from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateAccountResponse from 'src/category/responses/create-category.response'

const VerifyCategorySwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ description: 'Verify  category' }),
    ApiCreatedResponse({
      type: CreateAccountResponse,
      description: 'Category verified succefully',
    }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
  )
}

export default VerifyCategorySwaggerDefinition
