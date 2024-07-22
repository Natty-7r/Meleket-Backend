import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import { CreateCategoryFinalDto } from './dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateCategoryImageFinalDto,
} from './dto/update-category.dto'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'

@Injectable()
@UseGuards(JwtAuthGuard)
export default class BusinessService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryFinalDto) {
    const previesCategory = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name },
    })
    if (previesCategory)
      throw new ConflictException('Category with same name exits!')

    const parentCategory = await this.prismaService.category.findFirst({
      where: { parentId: createCategoryDto.parentId },
    })
    if (!parentCategory)
      throw new BadRequestException('Invalid parent category id ')

    const category = await this.prismaService.category.create({
      data: { ...createCategoryDto },
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
  }: UpdateCategoryDto) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

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

  async updateCategoryImage({ id, image }: UpdateCategoryImageFinalDto) {
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
}
