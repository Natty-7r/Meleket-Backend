import { Injectable } from '@nestjs/common'
import { SendOTPParam } from 'src/common/util/types'
import MessageStrategy from './interfaces/message-strategry.interface'

@Injectable()
export default class MessageService {
  private strategy: MessageStrategy

  setStrategy(strategy: MessageStrategy) {
    this.strategy = strategy
  }

  async sendOTP(params: SendOTPParam) {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendOTP(params)
  }
}
