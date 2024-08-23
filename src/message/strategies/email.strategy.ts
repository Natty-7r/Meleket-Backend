import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  SendAccountCreationParam,
  SendEmailParam,
  SendMessageParam,
  SendOTPParam,
} from 'src/common/util/types'
import {
  generateAccountCreationEmailMessage,
  generateResetEmailOTPMessage,
  generateVerifyEmailOTPMessage,
} from 'src/common/util/helpers/string-util'
import { MailerService } from '@nestjs-modules/mailer'
import MessageStrategy from '../interfaces/message-strategry.interface'
import ErrorLoggerStrategry from 'src/logger/winston-logger/strategies/error-logger.strategry'
import WinstonLoggerService from 'src/logger/winston-logger/winston-logger.service'
import ActivityLoggerStrategry from 'src/logger/winston-logger/strategies/activity-logger.strategry'

@Injectable()
export default class EmailStrategy implements MessageStrategy {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private errorLogger: WinstonLoggerService,
    private activityrLogger: WinstonLoggerService,
  ) {
    this.errorLogger.configure(new ErrorLoggerStrategry())
    this.activityrLogger.configure(new ActivityLoggerStrategry())
  }

  async #sendEmail({ address, subject, body }: SendEmailParam) {
    try {
      const message = await this.mailerService.sendMail({
        sender: this.configService.get<string>('email.sender'),
        to: address,
        subject,
        text: subject,
        html: body,
      })
      this.activityrLogger.log(message)
      return message
    } catch (error) {
      this.errorLogger.error(error)
    }
  }

  async sendMessage(params: SendMessageParam): Promise<void> {}

  async sendOTP({
    otp,
    otpType,
    firstName,
    address,
  }: SendOTPParam): Promise<void> {
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
  }: SendAccountCreationParam): Promise<void> {
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
