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
import User from 'src/common/decorators/user.decorator'
import { ApiTags } from '@nestjs/swagger'
import { RequestUser } from 'src/common/types/base.type'
import UserService from './user.service'
import AddReviewDto from './dto/add-review.dto'
import {
  AddProfile,
  AddRating,
  AddReveiw,
  DeleteReview,
  FollowBusiness,
  GetFollowedBusiness,
  UnFollowBusiness,
  UpdateProfile,
  UpdateReview,
  ViewStory,
} from './decorators/user-endpoint.decorator'
import EditReviewDto from './dto/edit-review.dto'
import AddRatingDto from './dto/add-rating.dto'
import AddProfileDto from './dto/add-profile.dto'

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

  @Post('review')
  @AddReveiw()
  addReview(@Body() addReviewDto: AddReviewDto, @User() user: RequestUser) {
    return this.userService.addReview({
      ...addReviewDto,
      userId: user.id,
    })
  }

  @Put('review')
  @UpdateReview()
  updateReview(
    @Body() editReviewDto: EditReviewDto,
    @User() user: RequestUser,
  ) {
    return this.userService.updateReview({
      ...editReviewDto,
      userId: user.id,
    })
  }

  @Delete('review/:id')
  @DeleteReview()
  deleteReview(@Param('id') id: string, @User() user: RequestUser) {
    return this.userService.deleteReview({
      id,
      userId: user.id,
    })
  }

  @AddRating()
  @Post('rating')
  addRaging(@Body() addRatingDto: AddRatingDto, @User() user: RequestUser) {
    return this.userService.addRating({
      ...addRatingDto,
      userId: user.id,
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
