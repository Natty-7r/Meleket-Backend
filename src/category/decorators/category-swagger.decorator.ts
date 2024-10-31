import { applyDecorators } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger'
import CategoryTreeResponse from '../responses/category-tree.response'
import CreateCategoryDto from '../dto/create-category.dto'

const categoryTreeExample = {
  id: 'c55931c4-5c45-4e81-95d6-6fd2c98d4611',
  name: 'Barber',
  parentId: null,
  image: 'uploads/category/category.png',
  level: 1,
  price: 100,
  children: [
    {
      id: 'c55931c4-5c45-4e81-95d6-6fd2c98d4611',
      name: 'Barber',
      parentId: null,
      image: 'uploads/category/category.png',
      level: 1,
      price: 100,
      children: [],
    },
  ],
}

export const CreateCategorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create Category' }),
    ApiCreatedResponse({
      description: 'Category created successfully',
    }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
    ApiConflictResponse({ description: 'Category with the same name exists' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      type: CreateCategoryDto,
      description: 'Category creation data',
    }),
  )

export const DeleteCategorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete category ' }),
    ApiResponse({ description: 'Category deleted succefully' }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
  )

export const UpdateCategorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update category' }),
    ApiResponse({ description: 'Category  updated succefully' }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
    ApiParam({ description: 'Category ID', name: 'id' }),
  )

export const UpdateCategoryImageSwaggerDefinition = (
  ...optionalDecorators: Function[]
) =>
  applyDecorators(
    ApiOperation({ summary: 'Update category image' }),
    ApiCreatedResponse({
      type: CategoryTreeResponse,
      description: 'Category  image  updated succefully',
      example: {
        id: 'c55931c4-5c45-4e81-95d6-6fd2c98d4611',
        name: 'Barber',
        parentId: null,
        image: 'uploads/category/category.png',
        level: 1,
        price: 100,
        children: [],
      },
    }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiConsumes('multipart/form-data'),
    ...(optionalDecorators as any),
  )
export const UpdateCategoryParentSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update category parent' }),
    ApiResponse({ description: 'Category  parent  updated succefully' }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiNotFoundResponse({ description: 'Invalid parent category id  ' }),
  )

export const VerifyCategorySwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Verify  category' }),
    ApiResponse({ description: 'Category verified succefully' }),
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
  )

export const GetCategoriesSwaggerDefinition = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get  category' }),
    ApiResponse({ description: 'Categories fetched succefully' }),
  )
