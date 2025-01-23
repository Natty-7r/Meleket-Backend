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
import { RequestUser } from 'src/common/types/base.type'
import User from 'src/common/decorators/user.decorator'
import {
  AddStory,
  UpdateStory,
  DeleteStory,
  GetBusinessStories,
  GetAllStories,
} from './decorators/business-story-endpoint.decorator'
import BusinessStoryService from './business-story.service'
import CreateStoryDto from './dto/create-story.dto'
import UpdateStoryDto from './dto/update-store.dto'

@ApiTags('Businesses-Stories')
@Controller('businesses/stories')
export default class BusinessStoryController {
  constructor(private readonly businessStoryService: BusinessStoryService) {}

  @Post()
  @AddStory()
  async addStory(
    @Body() createStoryDto: CreateStoryDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessStoryService.addStory({
      ...createStoryDto,
      userId: user.id,
      image: file?.path || undefined,
    })
  }

  @Put()
  @UpdateStory()
  async updateStory(
    @Body() updateStoryDto: UpdateStoryDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessStoryService.updateStory({
      ...updateStoryDto,
      userId: user.id,
      image: file?.path || undefined,
    })
  }

  @Delete(':id')
  @DeleteStory()
  async deleteStory(@Param('id') id: string, @User() user: RequestUser) {
    return this.businessStoryService.deleteStory({
      userId: user.id,
      id,
    })
  }

  @Get()
  @GetAllStories()
  async fetchAllStories(@User() user: RequestUser) {
    return this.businessStoryService.getStories({ userId: user.id })
  }

  @Get(':businessId')
  @GetBusinessStories()
  async getStories(
    @Param('businessId') businessId: string,
    @User() user: RequestUser,
  ) {
    return this.businessStoryService.getBusinessStories({
      businessId,
      userId: user.id,
    })
  }
}
