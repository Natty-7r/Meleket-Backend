import { Module } from '@nestjs/common'
import BusinessServiceController from './business-service.controller'
import BusinessServiceService from './business-service.service'

@Module({
  providers: [BusinessServiceService],
  exports: [BusinessServiceService],
  controllers: [BusinessServiceController],
})
export default class BusinessServiceModule {}
