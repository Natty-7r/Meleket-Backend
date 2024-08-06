import { Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParam,
  SendMessageParam,
  SendOTPParam,
  SendSMSParam,
} from 'src/common/util/types'
import MessageStrategy from '../interfaces/message-strategry.interface'
import {
  generateResetSMSOTPMessage,
  generateVerifySMSOTPMessage,
} from 'src/common/util/helpers/string-util'

@Injectable()
export default class SmsStrategy implements MessageStrategy {
  constructor(
    private twilioService: TwilioService,
    private configService: ConfigService,
  ) {}

  async #sendSMS({ smsBody, smsAddress }: SendSMSParam) {
    return this.twilioService.client.messages.create({
      from: this.configService.get<string>('twilio.smsSender'),
      body: smsBody,
      to: smsAddress,
    })
  }

  async SendMessageParam(messageParams: SendMessageParam): Promise<void> {}

  async sendOTP({
    otp,
    otpType,
    firstName,
    address,
  }: SendOTPParam): Promise<void> {
    const smsBody =
      otpType == 'VERIFICATION'
        ? generateVerifySMSOTPMessage({ firstName, otp })
        : generateResetSMSOTPMessage({ firstName, otp })

    await this.#sendSMS({ smsAddress: address, smsBody })
  }
  async SendAccountCreationMessage(
    params: SendAccountCreationParam,
  ): Promise<void> {}
}
