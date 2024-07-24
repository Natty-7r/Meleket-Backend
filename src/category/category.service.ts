import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import { CreateCategoryFinalDto } from './dto/create-category.dto'
import {
  UpdateCategoryDto,
  UpdateCategoryImageFinalDto,
} from './dto/update-category.dto'

@Injectable()
@UseGuards(JwtAuthGuard)
export default class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryFinalDto) {
    console.log(createCategoryDto)
    const previesCategory = await this.prismaService.category.findFirst({
      where: { name: createCategoryDto.name },
    })
    if (previesCategory)
      throw new ConflictException('Category with same name exits!')

    if(createCategoryDto.parentId){
    const parentCategory = await this.prismaService.category.findFirst({
      where: { parentId: createCategoryDto.parentId },
    })
    if(createCategoryDto.level==1)
      throw new ConflictException('first level category can not have Parent id ')
    if (!parentCategory)
      throw new BadRequestException('Invalid parent category id ')

    }

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
    parentId,verified
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
        verified:verified || category.verified
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
  async verifyCategory(id :string) {
    const category = await this.prismaService.category.findFirst({
      where: { id },
    })

    if (!category) throw new NotFoundException('Invalid category id')

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data: {
      verified:true
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
}
