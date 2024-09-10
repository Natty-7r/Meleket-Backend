import { Injectable } from '@nestjs/common'
import {
  SendAccountCreationParams,
  SendMessageParams,
  SendOTPParams,
} from 'src/common/util/types/params.type'
import MessageStrategy from './interfaces/message-strategry.interface'

@Injectable()
export default class MessageService implements MessageStrategy {
  private strategy: MessageStrategy

  setStrategy(strategy: MessageStrategy) {
    this.strategy = strategy
  }

  async sendOTP(params: SendOTPParams) {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendOTP(params)
  }

  async sendAccountCreationMessage(params: SendAccountCreationParams) {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendAccountCreationMessage(params)
  }

  async sendMessage(params: SendMessageParams): Promise<void> {
    if (!this.strategy) {
      throw new Error('No strategy set')
    }
    return this.strategy.sendMessage(params)
  }
}
