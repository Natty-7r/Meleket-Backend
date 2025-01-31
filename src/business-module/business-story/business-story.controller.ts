import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import BusinessStoryService from './business-story.service'
import {
  AddStory,
  DeleteStory,
  GetBusinessStories,
  UpdateStory,
} from './decorators/business-story-endpoint.decorator'
import CreateStoryDto from './dto/create-story.dto'
import UpdateStoryDto from './dto/update-store.dto'

@ApiTags('Businesses-Stories')
@Controller('businesses')
export default class BusinessStoryController {
  constructor(private readonly businessStoryService: BusinessStoryService) {}

  @Post('/:id/stories')
  @AddStory()
  async addStory(
    @Body() createStoryDto: CreateStoryDto,
    @User() user: RequestUser,
    @Param('id') businessId: string,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.businessStoryService.addStory({
      ...createStoryDto,
      userId: user.id,
      businessId,
      images,
    })
  }

  @Put('stories/:id')
  @UpdateStory()
  async updateStory(
    @Body() updateStoryDto: UpdateStoryDto,
    @User() user: RequestUser,
    @Param('id') id: string,
    @UploadedFile() images?: Express.Multer.File[],
  ) {
    return this.businessStoryService.updateStory({
      ...updateStoryDto,
      userId: user.id,
      id,
      images,
    })
  }

  @Delete('stories/:id')
  @DeleteStory()
  async deleteStory(@Param('id') id: string, @User() user: RequestUser) {
    return this.businessStoryService.deleteStory({
      userId: user.id,
      id,
    })
  }

  @Get(':id/stories')
  @GetBusinessStories()
  async getStories(@Param('id') businessId: string, @User() user: RequestUser) {
    return this.businessStoryService.getBusinessStories({
      businessId,
      userId: user.id,
    })
  }
}
