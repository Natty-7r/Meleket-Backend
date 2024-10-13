import { Module } from '@nestjs/common'
import BusinessReviewModule from './business-review/business-review.module'
import BusinessAddressModule from './business-address/business-address.module'
import BusinessStoryModule from './business-story/business-story.module'
import BusinessModule from './business/business.module'
import BusinessServiceModule from './business-service/business-service.module'

@Module({
  imports: [
    BusinessModule,
    BusinessAddressModule,
    BusinessStoryModule,
    BusinessStoryModule,
    BusinessServiceModule,
    BusinessReviewModule,
  ],
})
export default class BaseBusinessModule {}
