import { Module } from '@nestjs/common'
import BusinessModule from 'src/business/business.module'
import PaymentService from './payment.service'
import PaymentController from './payment.controller'

@Module({
  imports: [BusinessModule],
  providers: [PaymentService],
  controllers: [PaymentController],
})
export default class PaymentModule {}
