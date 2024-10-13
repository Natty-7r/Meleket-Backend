import { Module } from '@nestjs/common'
import UserModule from 'src/user/user.module'
import BusinessReviewService from './business-review.service'
import BusinessReviewController from './business-review.controller'
import BusinessModule from '../business/business.module'

@Module({
  imports: [BusinessModule, UserModule],
  providers: [BusinessReviewService],
  controllers: [BusinessReviewController],
})
export default class BusinessReviewModule {}
