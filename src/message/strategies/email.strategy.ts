import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParams,
  SendEmailParams,
  SendMessageParams,
  SendOTPParams,
} from 'src/common/types/params.type'
import {
  generateAccountCreationEmailMessage,
  generateResetEmailOTPMessage,
  generateVerifyEmailOTPMessage,
} from 'src/common/helpers/string.helper'
import { MailerService } from '@nestjs-modules/mailer'
import LoggerService from 'src/logger/logger.service'
import MessageStrategy from '../interfaces/message-strategry.interface'

@Injectable()
export default class EmailStrategy implements MessageStrategy {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  async #sendEmail({ address, subject, body }: SendEmailParams) {
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
    const emailBody =
      otpType === 'VERIFICATION'
        ? generateVerifyEmailOTPMessage({ firstName, otp })
        : generateResetEmailOTPMessage({ firstName, otp })

    await this.#sendEmail({
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
    const emailBody = generateAccountCreationEmailMessage({
      firstName,
      password,
    })
    await this.#sendEmail({
      address,
      body: emailBody,
      subject: 'New Account Creation',
    })
  }
}
