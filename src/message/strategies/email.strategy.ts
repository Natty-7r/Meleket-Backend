import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as handlbars from 'handlebars'
import {
  SendAccountCreationParams,
  SendEmailParams,
  SendMessageParams,
  SendOTPParams,
} from 'src/common/types/params.type'

import { MailerService } from '@nestjs-modules/mailer'
import LoggerService from 'src/logger/logger.service'
import { readFileContent } from 'src/common/helpers/file.helper'
import { EMAIL_TEMPLATE_FOLDER_PATH } from 'src/common/constants/base.constants'
import MessageStrategy from '../interfaces/message-strategry.interface'

@Injectable()
export default class EmailStrategy implements MessageStrategy {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  async sendEmail({ address, subject, body }: SendEmailParams) {
    try {
      const message = await this.mailerService.sendMail({
        sender: this.configService.get<string>('email.sender'),
        to: address,
        subject,
        text: subject,
        html: body,
      })
      this.loggerService.log('', { ...message, to: address, subject })
      return message
    } catch (error) {
      const emailError = {
        message: 'Unable to send email',
        to: address,
        subject,
        ...error,
      }
      this.loggerService.error('', emailError, error?.response)
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
    const emailBody = await this.getTemplate({
      fileName:
        otpType === 'VERIFICATION'
          ? 'verify-email.template.html'
          : 'reset-otp.template.html',
      data: { firstName, otp },
    })
    if (emailBody)
      await this.sendEmail({
        address,
        body: emailBody,
        subject:
          otpType === 'VERIFICATION'
            ? 'Verify Your Account'
            : 'Reset Your Account',
      })
  }

  async sendAccountCreationMessage({
    firstName,
    address,
    password,
  }: SendAccountCreationParams): Promise<void> {
    const emailBody = await this.getTemplate({
      fileName: 'account-creation.template.html',
      data: {
        firstName,
        password,
      },
    })
    await this.sendEmail({
      address,
      body: emailBody,
      subject: 'New Account Creation',
    })
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
        filePath: EMAIL_TEMPLATE_FOLDER_PATH + fileName,
      })
      const template = handlbars.compile(templateString, data)
      return template(data)
    } catch (error) {
      const emailError = {
        message: error?.message || 'Unable to read email tempalate',
        ...error,
      }
      this.loggerService.error('', emailError, error?.response)
      return undefined
    }
  }
}
