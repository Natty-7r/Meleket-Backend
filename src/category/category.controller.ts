import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  // Request,
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
import { CreateCategoryDto, CreateCategoryFinalDto } from './dto/create-category.dto'
import CategoryService from './category.service'
import {
  UpdateCategoryDto,
  UpdateCategoryImageDto,
} from './dto/update-category.dto'
import User from 'src/common/decorators/user.decorator'
import { User as UserAsType } from '@prisma/client'
import RolesGuard from 'src/common/guards/role.guard'
import Roles from 'src/common/decorators/roles.decorator'

@ApiTags('Category')
@Controller('category')
@UseGuards(JwtAuthGuard)
export default class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ description: 'Create category' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'Category  created succefully',
  })
  @ApiBadRequestResponse({ description: 'Invalid parent id' })
  @ApiConflictResponse({ description: 'Category with the same name exists' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Post('create-category')
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
   @User() user:UserAsType
  ) {
    return this.categoryService.createCategory({
      ...createCategoryDto,
      image: file?.path || 'uploads/category/category.png',
      price: createCategoryDto?.price || 50,
      verified: user?.userType =='ADMIN'|| user.userType =='SUPER_ADMIN' ? true:false
    })
  }

  @ApiOperation({ description: 'Update category' })
  @ApiCreatedResponse({
    type: UpdateCategoryDto,
    description: 'Category  updated succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid category id  ' })
  @ApiBadRequestResponse({ description: 'Invalid parent id' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
    }),
  )

  @Roles('ADMIN','SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Put('update-category')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(updateCategoryDto)
  }

  // update category
  @ApiOperation({ description: 'Update category image' })
  @ApiCreatedResponse({
    type: CreateCategoryFinalDto,
    description: 'Category  image  updated succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid category id  ' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
      fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Roles('ADMIN','SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Put('update-category-image')
  updateCategoryImage(
    @Body() { id }: UpdateCategoryImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategoryImage({ id, image: file.path })
  }


  
  @ApiOperation({ description: 'Verify  image' })
  @ApiCreatedResponse({
    type: CreateCategoryFinalDto,
    description: 'Category verified succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid category id  ' })

  @Roles('ADMIN','SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Put('verify-category')
  verifyCategory(
  @Param('id') id:string
  ) {
    return this.categoryService.verifyCategory(id)
  }
}
