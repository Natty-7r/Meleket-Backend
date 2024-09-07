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
import { Category } from '@prisma/client'
import UpdateCategoryDto from './dto/update-category.dto'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateCategoryImageDto from './dto/update-category-image.dto '

@Injectable()
@UseGuards(JwtAuthGuard)
export default class CategoryService {
  categoryTree: CategoryTreeNode[]

  constructor(private readonly prismaService: PrismaService) {}

  generateCategoryTree(allCategories: Category[]) {
    const categoryMap = new Map<string, CategoryTreeNode>()
    allCategories.forEach((category) => {
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

    allCategories.forEach((category) => {
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

  async createCategory(
    createCategoryDto: CreateCategoryDto,
    verified: boolean,
  ) {
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
        verified,
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
  }: UpdateCategoryDto) {
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

  async updateCategoryImage({ id }: UpdateCategoryImageDto, image: string) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
        image,
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

  async verifyCategory(id: string) {
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

  async getCategories() {
    const allCategories = await this.prismaService.category.findMany()
    return {
      status: 'success',
      message: 'categories fetched',
      data: this.generateCategoryTree(allCategories),
    }
  }

  async deleteCategory(id: string) {
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
      data: this.generateCategoryTree(updatedCategories),
    }
  }

  async updateParentCategory({
    parentId,
    childrenId,
  }: UpdateParentCategoryDto) {
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
      data: this.generateCategoryTree(updatedCategories),
    }
  }
}
