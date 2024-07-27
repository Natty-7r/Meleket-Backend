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
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { FileInterceptor } from '@nestjs/platform-express'
import { multerFilter, muluterStorage } from 'src/common/util/helpers/multer'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'
import {
  CreateCategoryDto,
  CreateCategoryFinalDto,
} from './dto/create-category.dto'
import CategoryService from './category.service'
import {
  UpdateCategoryDto,
  UpdateCategoryImageDto,
} from './dto/update-category.dto'
import User from 'src/common/decorators/user.decorator'
import { User as UserAsType } from '@prisma/client'
import RolesGuard from 'src/common/guards/role.guard'
import Roles from 'src/common/decorators/roles.decorator'
import UpdateParentCategoryDto from './dto/update-category-parent.dto'
import CreateCategorySwaggerDefinition from './decorators/swagger/create-category.swagger'
import UpdateCategorySwaggerDefinition from './decorators/swagger/update-image-category.swagger '
import UpdateCImageategorySwaggerDefinition from './decorators/swagger/update-image-category.swagger '
import VerifyCategorySwaggerDefinition from './decorators/swagger/verify-category.swagger'

@ApiTags('Category')
@Controller('category')
// @UseGuards(JwtAuthGuard)
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @CreateCategorySwaggerDefinition()
  @Post('create-category')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
    }),
  )
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserAsType,
  ) {
    return this.categoryService.createCategory({
      ...createCategoryDto,
      image: file?.path || 'uploads/category/category.png',
      price: createCategoryDto?.price || 50,
      verified:
        user?.userType == 'ADMIN' || user?.userType === 'SUPER_ADMIN'
          ? true
          : false,
    })
  }

  @UpdateCategorySwaggerDefinition()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
    }),
  )
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update-category')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto)
  }

  // update category
  @UpdateCImageategorySwaggerDefinition()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
    }),
  )
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update-category-image')
  updateCategoryImage(
    @Body() { id }: UpdateCategoryImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryImage({ id, image: file.path })
  }

  @VerifyCategorySwaggerDefinition()
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('verify-category')
  verifyCategory(@Param('id') id: string) {
    return this.categoryService.verifyCategory(id)
  }

  @ApiOperation({ description: 'Get categories' })
  @ApiCreatedResponse({
    description: 'Category verified succefully',
  })
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Get('all')
  getCategories() {
    return this.categoryService.getCategories()
  }

  @ApiOperation({ description: 'Delete category ' })
  @ApiCreatedResponse({
    type: CreateCategoryFinalDto,
    description: 'Category verified succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid category id  ' })
  @ApiNotFoundResponse({ description: 'Category has children  ' })
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Delete('delete')
  deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id)
  }

  @ApiOperation({ description: 'Update Parent category' })
  @ApiCreatedResponse({
    type: CreateCategoryFinalDto,
    description: 'Parent category updated  succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid parent  id  ' })
  @Roles('ADMIN', 'SUPER_ADMIN')
  @Put('update-parent')
  updateParentCategory(
    @Body() updateParentCategoryDto: UpdateParentCategoryDto,
  ) {
    return this.categoryService.updateParentCategory(updateParentCategoryDto)
  }
}
