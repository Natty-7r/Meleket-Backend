import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TwilioService } from 'nestjs-twilio'
import {
  SendEmailParam,
  SendSMSParam,
  SendOTPParam,
} from 'src/common/util/types'

@Injectable()
export default class MessageService {
  constructor(
    private twilioService: TwilioService,
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}
  async #sendSMS({ smsBody, recieverPhone }: SendSMSParam) {
    return this.twilioService.client.messages.create({
      from: this.configService.get<string>('twilio.smsSender'),
      body: smsBody,
      to: recieverPhone,
    })
  }

  async #sendEmail({ recieverEmail, subject, body }: SendEmailParam) {
    this.mailerService.sendMail({
      sender: process.env.EMAIL_SENDER,
      to: recieverEmail,
      subject,
      text: subject,
      html: body,
    })
  }

  async sendVerificationOTPSMS({
    firstName,
    otp,
    channelValue: recieverPhone,
  }: SendOTPParam) {
    return this.#sendSMS({
      recieverPhone,
      smsBody: `MELEKET(መለከት )ADD-BOARD\n\n  <p>Dear ${firstName.toUpperCase()},</p>\nYour OTP for account verification is: ${otp}\nPlease enter this code to complete your verification process.    
        For assistance, visit: Support Team`,
    })
  }

  async sendResetOTPSMS({
    firstName,
    channelValue: recieverPhone,
    otp,
  }: SendOTPParam) {
    return this.#sendSMS({
      recieverPhone,
      smsBody: `MELEKET(መለከት )ADD-BOARD\n\n  <p>Dear ${firstName.toUpperCase()},</p>\nYour OTP for account verification is: ${otp}\nPlease enter this code to reset account.    
        For assistance, visit: Support Team`,
    })
  }
  async sendResetOTPEmail({
    firstName,
    channelValue: recieverEmail,
    otp,
  }: SendOTPParam) {
    return this.#sendEmail({
      recieverEmail,
      subject: 'MELEKET(መለከት )ADD-BOARD - Account Verification',
      body: `<!DOCTYPE html>
          <html>
          <head>
              <title>MELEKET(መለከት )ADD-BOARD - Account Verification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                      <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; padding: 20px;">
                              <tr>
                                  <td align="center" style="padding-bottom: 20px;">
                                      <h2 style="color: #0056b3;">MELEKET(መለከት )ADD-BOARD - Account Verification</h2>
                                  </td>
                              </tr>
                              <tr>
                                  <td>
                                      <p>Dear ${firstName.toUpperCase()},</p>
                                      <p>We have received a request to reset your account. Please use the One-Time Password (OTP) below to complete the verification process:</p>
                                      <p style="font-size: 20px; font-weight: bold;">Your OTP for account verification is: ${otp}</p>
                                      <p>Please enter this code to reset your account.</p>
                                      <p>If you need any assistance, feel free to visit our <a href="URL_TO_SUPPORT_TEAM" style="color: #0056b3;">Support Team</a>.</p>
                                      <p>Best regards,<br>The MELEKET(መለከት )ADD-BOARD Team</p>
                                  </td>
                              </tr>
                          </table>
                      </td>
                  </tr>
              </table>
          </body>
          </html>
          `,
    })
  }
  async sendAdminTempPassword({
    channelValue: recieverEmail,
    firstName,
    otp,
  }: SendOTPParam) {
    return this.#sendEmail({
      recieverEmail,
      subject: 'MELEKET(መለከት )ADD-BOARD - Account Verification',
      body: ` <!DOCTYPE html>
    <html>
    <head>
        <title>New Account Creation - Admin Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; padding: 20px;">
                        <tr>
                            <td align="center" style="padding-bottom: 20px;">
                                <h2 style="color: #0056b3;">New Account Creation - Admin Notification</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Dear ${firstName},</p>
                                <p>A new account has been created, and the initial password for the user is provided below:</p>
                                <p style="font-size: 20px; font-weight: bold;">First Password: <span style="color: #0056b3;">${otp}</span></p>
                                <p>Please ensure that this information is securely stored and shared only with the intended user.</p>
                                <p>If you have any questions or need further assistance, please contact our support team.</p>
                                <p>Best regards,<br>The MELEKET(መለከት )ADD-BOARD Team</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`,
    })
  }
  async sendVerificationOTPEmail({
    channelValue: recieverEmail,
    otp,
    firstName,
  }: SendOTPParam) {
    return this.#sendEmail({
      recieverEmail,
      subject: 'MELEKET(መለከት )ADD-BOARD - Account Verification',
      body: ` <!DOCTYPE html>
    <html>
    <head>
        <title>New Account Creation - Notification</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="border: 1px solid #ddd; padding: 20px;">
                        <tr>
                            <td align="center" style="padding-bottom: 20px;">
                                <h2 style="color: #0056b3;">New Account Creation - Admin Notification</h2>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Dear ${firstName},</p>
                                <p> Your OTP for account verification is: <span style="color: #0056b3;">${otp} </span> \nPlease enter this code to complete your verification process.    
        For assistance, visit: Support Team
                               
                                <p>If you have any questions or need further assistance, please contact our support team.</p>
                                <p>Best regards,<br>The MELEKET(መለከት )ADD-BOARD Team</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`,
    })
  }
}
