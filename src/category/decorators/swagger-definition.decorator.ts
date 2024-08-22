import { applyDecorators } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
} from '@nestjs/swagger'
import CategoryTreeResponse from '../responses/category-tree.response'

export const CategoryTreeSwaggerDefinition = (
  operationName: string,
  successMessage: string,
  ...optionalDecorators: Function[]
) =>
  applyDecorators(
    ApiOperation({ description: operationName }),
    ApiResponse({
      type: CategoryTreeResponse,
      description: successMessage,
      example: [
        {
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
        },
      ],
    }),
    ...(optionalDecorators as any),
  )

export const CreateCategorySwaggerDefinition = () =>
  CategoryTreeSwaggerDefinition(
    'Create category',
    'Category  created succefully',
    ApiCreatedResponse({
      description: 'Category  created succefully',
    }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
    ApiConflictResponse({ description: 'Category with the same name exists' }),
    ApiConsumes('image'),
  )

export const DeleteCategorySwaggerDefinition = () =>
  CategoryTreeSwaggerDefinition(
    'Delete category ',
    'Category deleted succefully',
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
  )

export const UpdateCategorySwaggerDefinition = () =>
  CategoryTreeSwaggerDefinition(
    'Update category',
    'Category  updated succefully',
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiBadRequestResponse({ description: 'Invalid parent id' }),
  )

export const UpdateCategoryImageCategorySwaggerDefinition = (
  ...optionalDecorators: Function[]
) =>
  applyDecorators(
    ApiOperation({ description: 'Update category image' }),
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
export const UpdateCategoryParentSwaggerDefinition = (
  ...optionalDecorators: Function[]
) =>
  CategoryTreeSwaggerDefinition(
    'Update category parent',
    'Category  parent  updated succefully',
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
    ApiNotFoundResponse({ description: 'Invalid parent category id  ' }),
    ...(optionalDecorators as any),
  )

export const VerifyCategorySwaggerDefinition = () =>
  CategoryTreeSwaggerDefinition(
    'Verify  category',
    'Category verified succefully',
    ApiNotFoundResponse({ description: 'Invalid category id  ' }),
  )
