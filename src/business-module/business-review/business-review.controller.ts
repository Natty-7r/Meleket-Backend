import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import { ApiTags } from '@nestjs/swagger'
import BusinessReviewService from './business-review.service'
import AddReviewDto from './dto/add-review.dto'
import {
  AddReview,
  DeleteReview,
  GetReviewDetail,
  GetReviews,
  UpdateReview,
} from './decorators/business-review-api.decorator'

@ApiTags('Bussiness-Review')
@Controller('businesses')
export default class BusinessReviewController {
  constructor(private readonly businessReviewService: BusinessReviewService) {}

  @GetReviews()
  @Get('/:id/review')
  getReviews(@Param('id') id: string) {
    return this.businessReviewService.getReviews({ businessId: id })
  }

  @GetReviewDetail()
  @Get('/review/:id')
  getReviewDetail(@Param('id') id: string) {
    return this.businessReviewService.getReviewDetail({ id })
  }

  @Post('/:id/review')
  @AddReview()
  addReview(
    @Body() addReviewDto: AddReviewDto,
    @User() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.businessReviewService.addReview({
      ...addReviewDto,
      businessId: id,
      userId: user.id,
    })
  }

  @Put('/review/:id')
  @UpdateReview()
  updateReview(
    @Body() editReviewDto: AddReviewDto,
    @User() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.businessReviewService.updateReview({
      ...editReviewDto,
      userId: user.id,
      id,
    })
  }

  @Delete('/review/:id')
  @DeleteReview()
  deleteReview(@Param('id') id: string, @User() user: RequestUser) {
    return this.businessReviewService.deleteReview({
      id,
      userId: user.id,
    })
  }
}
