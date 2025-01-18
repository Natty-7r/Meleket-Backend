import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import { CategoryTreeNode } from 'src/common/types/base.type'
import {
  BaseIdParams,
  BaseImageParams,
  BaseUserIdParams,
} from 'src/common/types/params.type'
import {
  ApiResponse,
  ApiResponseWithPagination,
} from 'src/common/types/responses.type'
import { deleteFileAsync } from 'src/common/helpers/file.helper'
import { Business } from '@prisma/client'
import BusinessService from 'src/business-module/business/business.service'
import AccessControlService from 'src/access-control/access-control.service'
import {
  PaginationParams,
  GenerateCategoryTreeParams,
  OptionalImageUrlParams,
} from '../common/types/params.type'
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
    private readonly accessControlService: AccessControlService,
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
    userId,
    parentId,
    ...createCategoryDto
  }: CreateCategoryDto &
    BaseUserIdParams &
    BaseImageParams): Promise<ApiResponse> {
    const { userType } = await this.accessControlService.verifyUserStatus({
      id: userId,
    })

    const previesCategory = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name.toLocaleLowerCase().trim() },
    })
    if (previesCategory)
      throw new ConflictException('Category with same name exits!')

    if (parentId) {
      if (createCategoryDto.level === 1)
        throw new ConflictException(
          'first level category can not have Parent id ',
        )

      const parentCategory = await this.prismaService.category.findFirst({
        where: { parentId },
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
        verified: userType === 'ADMIN',
        price: createCategoryDto.price || 50,
      },
    })

    return {
      status: 'success',
      message: 'Category created successfully',
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
      /*eslint-disable*/
      include: { _count: { select: { business: true, children: true } } },
      /*eslint-disable*/
    })

    if (!category) throw new NotFoundException('Invalid category id')

    /*eslint-disable*/
    if (category._count.children)
      throw new BadRequestException(
        `Category has ${category._count.children} children first move childrens to other parent`,
      )
    if (category._count.business > 0)
      throw new BadRequestException(
        `Category has ${category._count.business} business atached to it`,
      )
    /*eslint-disable*/
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
