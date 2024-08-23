import { Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParam,
  SendMessageParam,
  SendOTPParam,
  SendSMSParam,
} from 'src/common/util/types'
import {
  generateResetSMSOTPMessage,
  generateVerifySMSOTPMessage,
} from 'src/common/util/helpers/string-util'
import MessageStrategy from '../interfaces/message-strategry.interface'
import ErrorLoggerStrategy from 'src/logger/winston-logger/strategies/error-logger.strategry'
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import ActivityLoggerStrategry from 'src/logger/winston-logger/strategies/activity-logger.strategry'

@Injectable()
export default class SmsStrategy implements MessageStrategy {
  constructor(
    private twilioService: TwilioService,
    private configService: ConfigService,
    private errorLogger: WinstonLoggerService,
    private activityrLogger: WinstonLoggerService,
  ) {
    this.errorLogger.configure(new ErrorLoggerStrategy())
    this.activityrLogger.configure(new ActivityLoggerStrategry())
  }

  async #sendSMS({ smsBody, smsAddress }: SendSMSParam) {
    try {
      const message = await this.twilioService.client.messages.create({
        from: this.configService.get<string>('twilio.smsSender'),
        body: smsBody,
        to: smsAddress,
      })
      this.activityrLogger.log(message as any)
      return message
    } catch (error) {
      this.errorLogger.error(error)
    }
  }

  async sendMessage(messageParams: SendMessageParam): Promise<void> {}

  async sendOTP({
    otp,
    otpType,
    firstName,
    address,
  }: SendOTPParam): Promise<void> {
    const smsBody =
      otpType === 'VERIFICATION'
        ? generateVerifySMSOTPMessage({ firstName, otp })
        : generateResetSMSOTPMessage({ firstName, otp })

    await this.#sendSMS({ smsAddress: address, smsBody })
  }

  async sendAccountCreationMessage(
    params: SendAccountCreationParam,
  ): Promise<void> {}
}
