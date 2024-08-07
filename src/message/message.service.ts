import { Injectable } from '@nestjs/common'
import {
  SendAccountCreationParam,
  SendMessageParam,
  SendOTPParam,
} from 'src/common/util/types'
import MessageStrategy from './interfaces/message-strategry.interface'

@Injectable()
export default class MessageService implements MessageStrategy {
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

  async sendAccountCreationMessage(params: SendAccountCreationParam) {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendAccountCreationMessage(params)
  }

  async sendMessageParam(params: SendMessageParam): Promise<void> {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendMessage(params)
  }
}
