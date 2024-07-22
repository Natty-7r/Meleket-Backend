import {
  Body,
  Controller,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiConflictResponse,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerFilter, muluterStorage } from 'src/common/util/helpers/multer'
import { CreateCategoryDto } from './dto/create-category.dto'
import BusinessService from './business.service'
import {
  UpdateCategoryDto,
  UpdateCategoryImageDto,
} from './dto/update-category.dto'

@Controller('business')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOperation({ description: 'Create category' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'Category  created succefully',
  })
  @ApiConflictResponse({ description: 'Category exists' })
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
  ) {
    return this.businessService.createCategory({
      ...createCategoryDto,
      image: file?.path || 'uploads/category/category.png',
      price: createCategoryDto?.price || 50,
    })
  }

  @ApiOperation({ description: 'Update category' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
    description: 'Category  updated succefully',
  })
  @ApiNotFoundResponse({ description: 'Invalid category id  ' })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: muluterStorage({ folder: 'category', filePrefix: 'cat' }),
    }),
  )
  @Put('update-category')
  updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.businessService.updateCategory(updateCategoryDto)
  }

  // update category
  @ApiOperation({ description: 'Update category image' })
  @ApiCreatedResponse({
    type: CreateCategoryDto,
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
  @Put('update-category-image')
  updateCategoryImage(
    @Body() { id }: UpdateCategoryImageDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.businessService.updateCategoryImage({ id, image: file.path })
  }
}
