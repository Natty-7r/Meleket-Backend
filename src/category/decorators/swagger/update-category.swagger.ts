import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateAccountResponse from 'src/category/responses/create-category.response'

const UpdateCategorySwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ description: 'Update category' }),
    ApiCreatedResponse({
      type: CreateAccountResponse,
      description: 'Category  updated succefully',
    }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
  )
}

export default UpdateCategorySwaggerDefinition
