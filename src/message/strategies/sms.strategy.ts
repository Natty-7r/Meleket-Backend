import { Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParams,
  SendMessageParams,
  SendOTPParams,
  SendSMSParams,
} from 'src/common/types/params.type'
import {
  generateResetSMSOTPMessage,
  generateVerifySMSOTPMessage,
} from 'src/common/helpers/string.helper'
import LoggerService from 'src/logger/logger.service'
import MessageStrategy from '../interfaces/message-strategry.interface'

@Injectable()
export default class SmsStrategy implements MessageStrategy {
  constructor(
    private twilioService: TwilioService,
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  async #sendSMS({ smsBody, smsAddress, subject }: SendSMSParams) {
    try {
      const message = await this.twilioService.client.messages.create({
        from: this.configService.get<string>('twilio.smsSender'),
        body: smsBody,
        to: smsAddress,
      })
      this.loggerService.log('', {
        ...message,
        to: smsAddress,
        subject,
      })
      return message
    } catch (error) {
      const smsError = {
        message: 'Unable to send Sms ',
        to: smsAddress,
        subject,
        ...error,
      }
      this.loggerService.error('', smsError, error?.response)
      return null
    }
  }

  async sendMessage(params: SendMessageParams): Promise<void> {
    console.log(params)
  }

  async sendOTP({
    otp,
    otpType,
    firstName,
    address,
  }: SendOTPParams): Promise<void> {
    const smsBody =
      otpType === 'VERIFICATION'
        ? generateVerifySMSOTPMessage({ firstName, otp })
        : generateResetSMSOTPMessage({ firstName, otp })

    await this.#sendSMS({
      smsAddress: address,
      smsBody,
      subject:
        otpType === 'VERIFICATION'
          ? 'Verify Your Account'
          : 'Reset Your Account',
    })
  }

  async sendAccountCreationMessage(
    params: SendAccountCreationParams,
  ): Promise<void> {
    console.log(params)
  }
}
