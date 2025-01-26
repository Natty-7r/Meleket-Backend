import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import { SortType } from 'src/common/types/params.type'
import CreateCategoryDto from './dto/create-category.dto'
import CategoryService from './category.service'
import UpdateCategoryDto from './dto/update-category.dto'
import {
  CreateCategory,
  DeleteCategory,
  GetCategories,
  GetCategoryBusinesses,
  UpdateCategory,
  UpdateCategoryParent,
  VerifyCategory,
} from './decorators/category-api-endpoint.decorator'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import CategoryQueryDto from './dto/category-query.dto'

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
  getCategories(@Query() query: CategoryQueryDto) {
    return this.categoryService.getCategories(query)
  }

  @GetCategoryBusinesses()
  @Get('/business/:id')
  getCategoryBusiness(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, // Default to page 1
    @Query('items', new DefaultValuePipe(10), ParseIntPipe) items: number, // Default to 10 items per page
    @Query('sort') sort: string[], // Sorting fields
    @Query('sortType', new DefaultValuePipe('desc')) sortType: SortType,
  ) {
    console.log('aaaaaaaaaaaaaa')
    return this.categoryService.getCategoryBusiness({
      id,
      page,
      items,
      sort,
      sortType,
    })
  }

  @DeleteCategory()
  @Delete(':id')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory({ id })
  }
}
