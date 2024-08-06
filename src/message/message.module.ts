import MessageService from './message.service'
import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TwilioModule } from 'nestjs-twilio'
import { MailerModule } from '@nestjs-modules/mailer'
import SmsStrategy from './strategies/sms.strategy'
import EmailStrategy from './strategies/email.strategy'

@Global()
@Module({
  imports: [
    ConfigModule, // Ensure ConfigModule is imported
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get<string>('twilio.accountSid'),
        authToken: configService.get<string>('twilio.authToken'),
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.host'),
          port: configService.get<number>('email.port'),
          auth: {
            user: configService.get<string>('email.sender'),
            pass: configService.get<string>('email.senderPassword'),
          },
        },
      }),
    }),
  ],
  providers: [MessageService, SmsStrategy, EmailStrategy],
  exports: [MessageService, SmsStrategy, EmailStrategy],
})
export default class MessageModule {}
