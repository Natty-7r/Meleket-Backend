import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  SendEmailParam,
  SendMessageParam,
  SendOTPParam,
} from 'src/common/util/types'
import MessageStrategy from '../interfaces/message-strategry.interface'
import {
  generateResetEmailOTPMessage,
  generateVerifyEmailOTPMessage,
} from 'src/common/util/helpers/string-util'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export default class EmailStrategy implements MessageStrategy {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async #sendEmail({ address, subject, body }: SendEmailParam) {
    this.mailerService.sendMail({
      sender: this.configService.get<string>('email.sender'),
      to: address,
      subject,
      text: subject,
      html: body,
    })
  }

  async SendMessageParam(messageParams: SendMessageParam): Promise<void> {}

  async sendOTP({
    otp,
    otpType,
    firstName,
    address,
  }: SendOTPParam): Promise<void> {
    const emailBody =
      otpType == 'VERIFICATION'
        ? generateVerifyEmailOTPMessage({ firstName, otp })
        : generateResetEmailOTPMessage({ firstName, otp })

    await this.#sendEmail({
      address,
      body: emailBody,
      subject:
        otpType == 'VERIFICATION'
          ? 'Verify Your Account'
          : 'Reset Your Account',
    })
  }
}
