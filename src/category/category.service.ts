import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import { CategoryTreeNode } from 'src/common/util/types/base.type'
import BusinessService from 'src/business/business.service'
import { BaseIdParams } from 'src/common/util/types/params.type'
import {
  ApiResponse,
  ApiResponseWithPagination,
} from 'src/common/util/types/responses.type'
import { deleteFileAsync } from 'src/common/util/helpers/file.helper'
import { Business } from '@prisma/client'
import {
  PaginationParams,
  CreateCategoryParams,
  GenerateCategoryTreeParams,
  OptionalImageUrlParams,
} from '../common/util/types/params.type'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import UpdateCategoryDto from './dto/update-category.dto'

@Injectable()
@UseGuards(JwtAuthGuard)
export default class CategoryService {
  categoryTree: CategoryTreeNode[]

  constructor(
    private readonly prismaService: PrismaService,
    private readonly businessService: BusinessService,
  ) {}

  // helper function

  async verifyCategoryId({ id }: BaseIdParams) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })
    if (!category) throw new BadRequestException('Invalid category Id')
    return category
  }

  generateCategoryTree({
    categories,
  }: GenerateCategoryTreeParams): CategoryTreeNode[] {
    const categoryMap = new Map<string, CategoryTreeNode>()
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        image: category.image,
        level: category.level,
        price: category.price,
        children: [],
      })
    })

    categories.forEach((category) => {
      if (category.parentId && categoryMap.has(category.parentId)) {
        const parentCategory = categoryMap.get(category.parentId)
        parentCategory.children.push(categoryMap.get(category.id))
      }
    })

    const categoryTree = Array.from(categoryMap.values()).filter(
      (category) => !category.parentId,
    )
    this.categoryTree = categoryTree

    return categoryTree
  }

  async createCategory({
    imageUrl,
    ...createCategoryDto
  }: CreateCategoryDto & CreateCategoryParams): Promise<ApiResponse> {
    const previesCategory = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name.toLocaleLowerCase().trim() },
    })
    if (previesCategory)
      throw new ConflictException('Category with same name exits!')

    if (createCategoryDto.parentId) {
      if (createCategoryDto.level === 1)
        throw new ConflictException(
          'first level category can not have Parent id ',
        )

      const parentCategory = await this.prismaService.category.findFirst({
        where: { parentId: createCategoryDto.parentId },
      })
      if (!parentCategory)
        throw new BadRequestException('Invalid parent category id ')

      if (createCategoryDto.level !== parentCategory.level - 1)
        throw new ConflictException('Parent level should current level -1  ')
    } else if (createCategoryDto.level !== 1)
      throw new BadRequestException('New category should have level of 1 ')

    const category = await this.prismaService.category.create({
      data: {
        name: createCategoryDto.name.toLocaleLowerCase().trim(), // changing name for search
        ...createCategoryDto,
        image: imageUrl,
      },
    })

    return {
      status: 'success',
      message: 'Account created successfully',
      data: {
        ...category,
      },
    }
  }

  async updateCategory({
    id,
    name,
    level,
    price,
    parentId,
    verified,
  }: UpdateCategoryDto): Promise<ApiResponse> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })
    if (!category || !id) throw new NotFoundException('Invalid category id')

    if (parentId) {
      const parentCategory = await this.prismaService.category.findFirst({
        where: { parentId },
      })
      if (!parentCategory)
        throw new BadRequestException('Invalid parent category id ')
    }

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        level: level || category.level,
        name: name || category.name,
        price: price || category.price,
        parentId: parentId || category.parentId,
        verified: verified || category.verified,
      },
    })
    return {
      status: 'success',
      message: 'Category updated  successfully',
      data: {
        ...updatedCategory,
      },
    }
  }

  async updateCategoryImage({
    id,
    imageUrl,
  }: BaseIdParams & OptionalImageUrlParams): Promise<ApiResponse> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        image: imageUrl,
      },
    })
    deleteFileAsync({ filePath: category.image })
    return {
      status: 'success',
      message: 'Category updated  successfully',
      data: {
        ...updatedCategory,
      },
    }
  }

  async verifyCategory({ id }: BaseIdParams) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    })
    return {
      status: 'success',
      message: 'Category verified  successfully',
      data: {
        ...updatedCategory,
      },
    }
  }

  async getCategories(): Promise<ApiResponse> {
    const allCategories = await this.prismaService.category.findMany({})
    return {
      status: 'success',
      message: 'categories fetched',
      data: this.generateCategoryTree({ categories: allCategories }),
    }
  }

  async getCategoryBusiness({
    id,
    ...paginationParams
  }: BaseIdParams & PaginationParams): Promise<
    ApiResponseWithPagination<Business[]>
  > {
    const category = await this.verifyCategoryId({ id })
    return this.businessService.getCategoryBusinesses({
      ...paginationParams,
      categoryId: id,
      name: category.name,
    })
  }

  async deleteCategory({ id }: BaseIdParams): Promise<ApiResponse> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    const childrenCategory = await this.prismaService.category.findMany({
      where: {
        AND: [
          {
            parentId: { not: null },
          },
          {
            parentId: id,
          },
        ],
      },
    })

    if (childrenCategory && childrenCategory.length > 0)
      throw new BadRequestException(
        `Category has ${childrenCategory.length} children first move childrens to other parent`,
      )
    await this.prismaService.category.delete({
      where: {
        id,
      },
    })

    const updatedCategories = await this.prismaService.category.findMany()
    return {
      status: 'success',
      message: 'Category verified  successfully',
      data: this.generateCategoryTree({ categories: updatedCategories }),
    }
  }

  async updateParentCategory({
    parentId,
    childrenId,
  }: UpdateParentCategoryDto): Promise<ApiResponse> {
    const parentCategory = await this.prismaService.category.findFirst({
      where: { id: parentId },
    })
    if (!parentCategory || !parentId)
      throw new NotFoundException('Invalid parent id ')

    await this.prismaService.category.updateMany({
      where: {
        id: {
          in: childrenId,
        },
      },
      data: {
        parentId,
      },
    })
    const updatedCategories = await this.prismaService.category.findMany()
    return {
      status: 'success',
      message: 'Category updated  successfully',
      data: this.generateCategoryTree({ categories: updatedCategories }),
    }
  }
}
