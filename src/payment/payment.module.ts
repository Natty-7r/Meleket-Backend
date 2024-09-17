import { Module } from '@nestjs/common'
import BusinessModule from 'src/business/business.module'
import { ConfigService } from '@nestjs/config'
import PaymentService from './payment.service'
import PaymentController from './payment.controller'
import ChapaStrategy from './payment-strategies/chapa.strategy'

@Module({
  imports: [BusinessModule],
  providers: [
    PaymentService,

    {
      provide: ChapaStrategy,
      useFactory: (configService: ConfigService) => {
        return new ChapaStrategy(configService)
      },
      inject: [ConfigService],
    },
  ],
  controllers: [PaymentController],
})
export default class PaymentModule {}
