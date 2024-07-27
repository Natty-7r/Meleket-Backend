import { applyDecorators } from '@nestjs/common'
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import CreateAccountResponse from 'src/category/responses/create-category.response'

const UpdateCImageategorySwaggerDefinition = () => {
  return applyDecorators(
    ApiOperation({ description: 'Update category image' }),
    ApiCreatedResponse({
      type: CreateAccountResponse,
      description: 'Category  image  updated succefully',
    }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiConsumes('multipart/form-data'),
  )
}

export default UpdateCImageategorySwaggerDefinition
