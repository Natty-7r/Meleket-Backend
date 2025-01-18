import { Module } from '@nestjs/common'
import BusinessController from './business.controller'
import BusinessService from './business.service'

@Module({
  providers: [BusinessService],
  exports: [BusinessService],
  controllers: [BusinessController],
})
export default class BusinessModule {}
