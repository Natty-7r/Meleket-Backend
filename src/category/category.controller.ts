import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import User from 'src/common/decorators/user.decorator'
import { USER } from 'src/common/util/types/base.type'
import CreateCategoryDto from './dto/create-category.dto'
import CategoryService from './category.service'
import UpdateCategoryDto from './dto/update-category.dto'
import {
  CreateCategory,
  DeleteCategory,
  GetCategories,
  GetCategoryBusinesses,
  UpdateCategory,
  UpdateCategoryImage,
  UpdateCategoryParent,
  VerifyCategory,
} from './decorators/category-api-endpoint.decorator'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'

@ApiTags('Category')
@Controller('category')
@UseGuards(JwtAuthGuard)
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @CreateCategory()
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: USER,
  ) {
    return this.categoryService.createCategory({
      ...createCategoryDto,
      image: file?.path || 'uploads/category/category.png',
      price: createCategoryDto?.price || 50,
      verified: user.userType !== 'CLIENT_USER',
    })
  }

  @UpdateCategory()
  @Put()
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto)
  }

  @UpdateCategoryImage()
  @Put(':id/image')
  updateCategoryImage(
    @Param('id:') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryImage({
      id,
      imageUrl: file.path,
    })
  }

  @VerifyCategory()
  @Put(':id/status')
  verifyCategory(@Param('id') id: string) {
    return this.categoryService.verifyCategory({ id })
  }

  @UpdateCategoryParent()
  @Put('/parent')
  updateParentCategory(
    @Body() updateParentCategoryDto: UpdateParentCategoryDto,
  ) {
    return this.categoryService.updateParentCategory(updateParentCategoryDto)
  }

  @GetCategories()
  @Get('all')
  getCategories() {
    return this.categoryService.getCategories()
  }
  @GetCategoryBusinesses()
  @Get('/business/:id')
  getCategoryBusiness() {
    return this.categoryService.getCategories()
  }

  @DeleteCategory()
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory({ id })
  }
}
