import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
import UserService from './user.service'
import { USER } from 'src/common/util/types/base.type'
import User from 'src/common/decorators/user.decorator'
import AddReviewDto from './dto/add-review.dto'
import {
  AddRating,
  AddReveiw,
  DeleteReview,
  UpdateReview,
} from './decorators/user-endpoint.decorator'
import { ApiTags } from '@nestjs/swagger'
import EditReviewDto from './dto/edit-review.dto'
import AddRatingDto from './dto/add-rating.dto'

@ApiTags('User')
@Controller('user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('review')
  @AddReveiw()
  addReview(@Body() addReviewDto: AddReviewDto, @User() user: USER) {
    return this.userService.addReview({
      ...addReviewDto,
      userId: user.id,
    })
  }

  @Put('review')
  @UpdateReview()
  updateReview(@Body() editReviewDto: EditReviewDto, @User() user: USER) {
    return this.userService.updateReview({
      ...editReviewDto,
      userId: user.id,
    })
  }
  @Delete('review/:id')
  @DeleteReview()
  deleteReview(@Param('id') id: string, @User() user: USER) {
    return this.userService.deleteReview({
      id,
      userId: user.id,
    })
  }
  @AddRating()
  @Post('rating')
  addRaging(@Body() addRatingDto: AddRatingDto, @User() user: USER) {
    return this.userService.addRating({
      ...addRatingDto,
      userId: user.id,
    })
  }
}
