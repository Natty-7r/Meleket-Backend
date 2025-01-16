import { Module } from '@nestjs/common'
import BusinessAddressService from './business-address.service'
import BusinessAddressController from './business-address.controller'

@Module({
  imports: [],
  providers: [BusinessAddressService],
  exports: [BusinessAddressService],
  controllers: [BusinessAddressController],
})
export default class BusinessAddressModule {}
