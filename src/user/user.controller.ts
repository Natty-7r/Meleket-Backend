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
import {
  AddProfile,
  FollowBusiness,
  GetFollowedBusiness,
  UnFollowBusiness,
  UpdateProfile,
  ViewStory,
} from './decorators/user-endpoint.decorator'
import AddProfileDto from './dto/add-profile.dto'
import UserService from './user.service'

@ApiTags('User')
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('profile')
  @AddProfile()
  async addProfile(
    @Body() addProfileDto: AddProfileDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.addProfile({
      ...addProfileDto,
      userId: user.id,
      profilePicture: file?.path || undefined,
    })
  }

  @Put('profile')
  @UpdateProfile()
  async updateProfile(
    @Body() addProfileDto: AddProfileDto,
    @User() user: RequestUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.updateProfile({
      ...addProfileDto,
      userId: user.id,
      profilePicture: file?.path || undefined,
    })
  }

  @Post('following-businesses')
  @FollowBusiness()
  followBusiness(
    @Param('businessId') businessId: string,
    @User() user: RequestUser,
  ) {
    return this.userService.followBussiness({ id: user.id, businessId })
  }

  @Delete('following-businesses')
  @UnFollowBusiness()
  unFollowBusiness(
    @Param('businessId') businessId: string,
    @User() user: RequestUser,
  ) {
    return this.userService.unFollowBussiness({ id: user.id, businessId })
  }

  @Get('following-business')
  @GetFollowedBusiness()
  getFollowedBusiness(@User() user: RequestUser) {
    return this.userService.getFollowedBussiness({ id: user.id })
  }

  @Put('story/:storyId')
  @ViewStory()
  viewStory(@Param('storyId') storyId: string, @User() user: RequestUser) {
    return this.userService.viewStory({ userId: user.id, storyId })
  }
}
