import { Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParams,
  SendMessageParams,
  SendOTPParams,
  SendSMSParams,
} from 'src/common/util/types/params.type'
import {
  generateResetSMSOTPMessage,
  generateVerifySMSOTPMessage,
} from 'src/common/util/helpers/string-util'
import ErrorLoggerStrategy from 'src/logger/winston-logger/strategies/error-logger.strategry'
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import ActivityLoggerStrategry from 'src/logger/winston-logger/strategies/activity-logger.strategry'
import MessageStrategy from '../interfaces/message-strategry.interface'

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

  async #sendSMS({ smsBody, smsAddress, subject }: SendSMSParams) {
    try {
      const message = await this.twilioService.client.messages.create({
        from: this.configService.get<string>('twilio.smsSender'),
        body: smsBody,
        to: smsAddress,
      })
      this.activityrLogger.log('', {
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
      this.errorLogger.error('', smsError)
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
