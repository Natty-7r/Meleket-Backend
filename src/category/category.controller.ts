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

  @CreateCategory()
  @Post()
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: RequestUser,
  ) {
    console.log(user, 'jjjjj')
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

  @GetCategories()
  @Get('')
  getCategories() {
    return this.categoryService.getCategories()
  }

  @DeleteCategory()
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory({ id })
  }
}
