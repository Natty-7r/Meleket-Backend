import { Injectable } from '@nestjs/common'
import { TwilioService } from 'nestjs-twilio'
import { ConfigService } from '@nestjs/config'
import * as handlbars from 'handlebars'
import {
  SendAccountCreationParams,
  SendMessageParams,
  SendOTPParams,
  SendSMSParams,
} from 'src/common/types/params.type'
import LoggerService from 'src/logger/logger.service'
import { SMS_TEMPLATE_FOLDER_PATH } from 'src/common/constants/base.constants'
import { readFileContent } from 'src/common/helpers/file.helper'
import MessageStrategy from '../interfaces/message-strategry.interface'

@Injectable()
export default class SmsStrategy implements MessageStrategy {
  constructor(
    private twilioService: TwilioService,
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  async sendSMS({ smsBody, smsAddress, subject }: SendSMSParams) {
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
    const smsBody = await this.getTemplate({
      fileName:
        otpType === 'VERIFICATION'
          ? 'verify-email.template.html'
          : 'reset-otp.template.html',
      data: { firstName, otp },
    })
    if (smsBody)
      await this.sendSMS({
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

  async getTemplate({
    fileName,
    data,
  }: {
    fileName: string
    data: any
  }): Promise<string> {
    try {
      const templateString = await readFileContent({
        filePath: SMS_TEMPLATE_FOLDER_PATH + fileName,
      })
      const template = handlbars.compile(templateString, data)
      return template(data)
    } catch (error) {
      const emailError = {
        message: error?.message || 'Unable to read sms tempalate',
        ...error,
      }
      this.loggerService.error('', emailError, error?.response)
      return undefined
    }
  }
}
