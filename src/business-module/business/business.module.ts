import { Module } from '@nestjs/common'
import BusinessService from './business.service'
import BusinessController from './business.controller'

@Module({
  imports: [],
  providers: [BusinessService],
  exports: [BusinessService],
  controllers: [BusinessController],
})
export default class BusinessModule {}
