import { BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ETB_TO_USD_RATE } from 'src/common/constants/base.constants'
import { generateRandomString } from 'src/common/helpers/string.helper'
import {
  PaymentInitResponse,
  PaymentSuccessResponse,
} from 'src/common/types/base.type'
import { StripeInitOptionParams } from 'src/common/types/params.type'
import { ApiResponse } from 'src/common/types/responses.type'
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
    callbackUrl,
  }: StripeInitOptionParams): Promise<ApiResponse<PaymentInitResponse>> {
    try {
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
        success_url: `${callbackUrl}?status="success"`,
        cancel_url: `${callbackUrl}?status="fail"`,
      })
      return {
        status: 'success',
        message: 'success',
        data: {
          sessionId: session.id,
          checkout_url: session.url,
          reference: generateRandomString({}),
        },
      }
    } catch (error) {
      if (error?.message?.toLocaleLowerCase().includes('not a valid url'))
        throw new BadRequestException('Invalida callback url')
      return {
        status: 'fail',
        message: error?.message,
        data: null,
      }
    }
  }

  async verify(sessionId: string): Promise<PaymentSuccessResponse> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId)
      if (session.status === 'open')
        throw new BadRequestException('Payment not finished')
      if (session.status === 'expired')
        return {
          isExprired: true,
          amount: session.amount_subtotal / 100,
          currency: session.currency,
        }
      return {
        amount: session.amount_subtotal / 100,
        currency: session.currency,
      }
    } catch (error) {
      throw error
    }
  }
}
