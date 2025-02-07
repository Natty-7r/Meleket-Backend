import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import CategoryService from './category.service'
import {
  CreateCategory,
  DeleteCategory,
  GetCategories,
  GetCategoryDetail,
  UpdateCategory,
  UpdateCategoryParent,
  VerifyCategory,
} from './decorators/category-api-endpoint.decorator'
import CreateCategoryDto from './dto/create-category.dto'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import UpdateCategoryDto from './dto/update-category.dto'

@ApiTags('Category')
@Controller('category')
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @GetCategories()
  @Get('')
  getCategories() {
    return this.categoryService.getCategories()
  }

  @GetCategoryDetail()
  @Get('/:id')
  getCategoryDetail(@Param('id') id: string, @User() user: RequestUser) {
    return this.categoryService.getCagetoryDetail({ id })
  }

  @CreateCategory()
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: RequestUser,
  ) {
    return this.categoryService.createCategory({
      ...createCategoryDto,
      userId: user.id,
      image,
    })
  }

  @UpdateCategory()
  @Put('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.updateCategory({ ...updateCategoryDto, id })
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

  @DeleteCategory()
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory({ id })
  }
}
