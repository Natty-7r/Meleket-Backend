import {
  Body,
  Controller,
  Post,
  Put,
  Request,
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
} from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerFilter, muluterStorage } from 'src/common/util/helpers/multer'
import { CreateCategoryDto } from './dto/create-category.dto'
import BusinessService from './business.service'
import {
  UpdateCategoryDto,
  UpdateCategoryImageDto,
} from './dto/update-category.dto'
import JwtAuthGuard from 'src/auth/guards/jwt.guard'

@Controller('business')
@UseGuards(JwtAuthGuard)
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

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
    @Request() req: any,
  ) {
    console.log(req.user)
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
  @ApiBadRequestResponse({ description: 'Invalid parent id' })
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
