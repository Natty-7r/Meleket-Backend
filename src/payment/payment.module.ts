import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import UserModule from 'src/user/user.module'
import BusinessModule from 'src/business-module/business/business.module'
import PaymentService from './payment.service'
import PaymentController from './payment.controller'
import Chapa from './payment-strategies/chapa.strategy'
import Stripe from './payment-strategies/stripe.strategry'

@Module({
  imports: [BusinessModule, UserModule],
  providers: [
    PaymentService,
    {
      provide: Chapa,
      useFactory: (configService: ConfigService) => {
        return new Chapa(configService)
      },
      inject: [ConfigService],
    },
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService)
      },
      inject: [ConfigService],
    },
  ],
  controllers: [PaymentController],
})
export default class PaymentModule {}
