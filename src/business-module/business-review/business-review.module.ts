import { Module } from '@nestjs/common'
import BusinessReviewService from './business-review.service'
import BusinessReviewController from './business-review.controller'

@Module({
  providers: [BusinessReviewService],
  controllers: [BusinessReviewController],
})
export default class BusinessReviewModule {}
