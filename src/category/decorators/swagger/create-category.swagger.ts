import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateAccountResponse from 'src/category/responses/create-category.response'

const CreateCategorySwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ description: 'Create category' }),
    ApiCreatedResponse({
      type: CreateAccountResponse,
      description: 'Category  created succefully',
    }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
    ApiConflictResponse({ description: 'Category with the same name exists' }),
    ApiConsumes('multipart/form-data'),
  )
}

export default CreateCategorySwaggerDefinition
