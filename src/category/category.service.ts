import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Category } from '@prisma/client'
import AccessControlService from 'src/access-control/access-control.service'
import { CategoryDetail, CategoryTreeNode } from 'src/common/types/base.type'
import { BaseIdParams, BaseUserIdParams } from 'src/common/types/params.type'
import PrismaService from 'src/prisma/prisma.service'
import { GenerateCategoryTreeParams } from '../common/types/params.type'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import UpdateCategoryDto from './dto/update-category.dto'
import { MAIN_CATEGORY_PATH } from 'src/common/constants/base.constants'
import { deleteFileAsync } from 'src/common/helpers/file.helper'

@Injectable()
export default class CategoryService {
  categoryTree: CategoryTreeNode[]

  constructor(
    private readonly prismaService: PrismaService,
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
    const childrenIdList: string[] = []
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
        childrenIdList.push(category.id)
      }
    })

    for (const childrenId of childrenIdList) categoryMap.delete(childrenId)

    // const categoryTree = Array.from(categoryMap.values()).filter(
    //   (category) => !category.parentId,
    // )
    const categoryTree = Array.from(categoryMap.values())
    this.categoryTree = categoryTree

    return categoryTree
  }

  async createCategory({
    userId,
    parentId,
    image,
    ...createCategoryDto
  }: CreateCategoryDto & BaseUserIdParams): Promise<Category> {
    let level = 1
    const { userType } = await this.accessControlService.verifyUserStatus({
      id: userId,
    })

    const previesCategory = await this.prismaService.category.findFirst({
      where: {
        name: { mode: 'insensitive', equals: createCategoryDto.name },
      },
    })
    if (previesCategory)
      throw new ConflictException('Category with same name exits!')

    if (parentId) {
      const parentCategory = await this.prismaService.category.findFirst({
        where: { id: parentId },
      })

      if (!parentCategory)
        throw new BadRequestException('Invalid parent category id ')
      level = parentCategory.level + 1
    }

    return this.prismaService.category.create({
      data: {
        ...createCategoryDto,
        verified: userType === 'ADMIN',
        price: createCategoryDto.price || 50,
        image: image?.path || MAIN_CATEGORY_PATH,
        level,
        parentId: parentId || null,
      },
    })
  }

  async updateCategory({
    id,
    name,
    price,
    parentId,
    image,
  }: UpdateCategoryDto & BaseIdParams): Promise<CategoryTreeNode[]> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })
    let level = category.level
    if (!category || !id) throw new NotFoundException('Invalid category id')

    if (parentId) {
      const parentCategory = await this.prismaService.category.findFirst({
        where: { id: parentId },
      })
      if (!parentCategory)
        throw new BadRequestException('Invalid parent category id ')
      level = parentCategory.level + 1
    }

    if (image && category.image != MAIN_CATEGORY_PATH)
      deleteFileAsync({ filePath: category.image })

    await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        level: level,
        name: name || category.name,
        price: price || category.price,
        parentId: parentId || category.parentId,
        image: image?.path || MAIN_CATEGORY_PATH,
      },
    })
    const updatedCategories = await this.prismaService.category.findMany()
    return this.generateCategoryTree({ categories: updatedCategories })
  }

  async getCagetoryDetail({ id }: BaseIdParams) {
    const categoryDetail: CategoryDetail =
      await this.prismaService.category.findFirst({
        where: { id },
        include: {
          children: true,
          _count: { select: { business: true } },
        },
      })
    if (!categoryDetail) return null
    const { _count, children, ...category } = categoryDetail
    const tree = this.generateCategoryTree({
      categories: [category, ...children],
    })[0]
    return {
      tree: { ...category, children: tree.children },
      _count: {
        business: _count.business,
        children: children.length,
      },
    }
  }

  async verifyCategory({ id }: BaseIdParams): Promise<Category> {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    return this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    })
  }

  async getCategories(): Promise<CategoryTreeNode[]> {
    const allCategories = await this.prismaService.category.findMany({})
    return this.generateCategoryTree({ categories: allCategories })
  }

  async deleteCategory({ id }: BaseIdParams): Promise<CategoryTreeNode[]> {
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

    if (category.image != MAIN_CATEGORY_PATH)
      deleteFileAsync({ filePath: category.image })
    const updatedCategories = await this.prismaService.category.findMany()
    return this.generateCategoryTree({ categories: updatedCategories })
  }

  async updateParentCategory({
    parentId,
    childrenId,
  }: UpdateParentCategoryDto): Promise<CategoryTreeNode[]> {
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
        level: parentCategory.level + 1,
      },
    })
    const updatedCategories = await this.prismaService.category.findMany()
    return this.generateCategoryTree({ categories: updatedCategories })
  }
}
