import { ConfigService } from '@nestjs/config'
import { ETB_TO_USD_RATE } from 'src/common/constants/base.constants'
import { StripeSessionInfo } from 'src/common/types/base.type'
import { StripeInitOptionParams } from 'src/common/types/params.type'
import StripeBase from 'stripe'

export default class Stripe {
  stripe: StripeBase
  constructor(private readonly configService: ConfigService) {
    this.stripe = new StripeBase(
      this.configService.get<string>('stripe.secretKey'),
      { apiVersion: '2025-01-27.acacia' },
    )
  }
  async createCheckoutSession({
    amount,
    productName,
  }: StripeInitOptionParams): Promise<StripeSessionInfo> {
    console.log(this.configService.get<string>(''))
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productName },
            unit_amount: Math.round((amount / ETB_TO_USD_RATE) * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${this.configService.get<string>('server.host')}:${this.configService.get<string>('server.port')}/${this.configService.get<string>('stripe.successUrl')}`,
      cancel_url: `${this.configService.get<string>('server.host')}:${this.configService.get<string>('server.port')}/${this.configService.get<string>('stripe.failUrl')}`,
    })
    return { sessionId: session.id, url: session.url }
  }
}
