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
  UpdateCategory,
  UpdateCategoryImage,
  UpdateCategoryParent,
  VerifyCategory,
} from './decorators/category-api-endpoint.decorator'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import UpdateCategoryImageDto from './dto/update-category-image.dto '

@ApiTags('Category')
@Controller('category')
@UseGuards(JwtAuthGuard)
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @CreateCategory()
  @Post('create-category')
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: USER,
  ) {
    return this.categoryService.createCategory(
      {
        ...createCategoryDto,
        image: file?.path || 'uploads/category/category.png',
        price: createCategoryDto?.price || 50,
      },
      user.userType !== 'CLIENT_USER',
    )
  }

  @UpdateCategory()
  @Put('update-category')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto)
  }

  @UpdateCategoryImage()
  @Put('update-category-image')
  updateCategoryImage(
    @Body() updateCategoryImageDto: UpdateCategoryImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryImage(
      updateCategoryImageDto,
      file.path,
    )
  }

  @VerifyCategory()
  @Put('verify-category')
  verifyCategory(@Param('id') id: string) {
    return this.categoryService.verifyCategory(id)
  }

  @GetCategories()
  @Get('all')
  getCategories() {
    return this.categoryService.getCategories()
  }

  @DeleteCategory()
  @Delete('delete')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id)
  }

  @UpdateCategoryParent()
  @Put('update-parent')
  updateParentCategory(
    @Body() updateParentCategoryDto: UpdateParentCategoryDto,
  ) {
    return this.categoryService.updateParentCategory(updateParentCategoryDto)
  }
}
