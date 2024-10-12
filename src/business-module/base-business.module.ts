import { Module } from '@nestjs/common'
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
  ],
})
export default class BaseBusinessModule {}
