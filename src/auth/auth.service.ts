import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { OTPType, User, Category } from '@prisma/client'
import { CreateAccountDto, SignInDto } from './dto'
import { SignUpType } from 'src/common/util/types'
import { generateOTP } from 'src/common/util/helpers/numbers'
import MessageService from 'src/message/message.service'
import VerifyOTPDto from './dto/verify-otp.dto'
import { ConfigService } from '@nestjs/config'
import CreateOTPDto from './dto/create-otp.dto'
import VerifyUserDto from './dto/verify-user.dto'
import SmsStrategy from '../message/strategies/sms.strategy'
import EmailStrategy from 'src/message/strategies/email.strategy'
import UpdatePasswordDto from './dto/update-passowrd.dto'

@Injectable()
export default class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly confgiService: ConfigService,
    private readonly smsStrategy: SmsStrategy,
    private readonly emailStrategy: EmailStrategy,
  ) {}

  async createAccount(
    { firstName, lastName, email, password }: CreateAccountDto,
    signUpType: SignUpType,
  ) {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (user) throw new ConflictException('Email is already in use!')
    const hashedPassword = await bcrypt.hash(password, 12)

    const userCreated = await this.prismaService.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        profileLevel:
          signUpType == SignUpType.BY_EMAIL ? 'CREATED' : 'VERIFIED',
      },
    })

    const { password: _, ...rest } = userCreated
    if (signUpType == SignUpType.BY_EMAIL) {
      const { otpCode } = await this.#createOTP({
        channelType: 'EMAIL',
        email: email,
        type: 'VERIFICATION',
        phone: '',
        userType: 'CLIENT_USER',
      })

      this.messageService.setStrategy(this.emailStrategy)
      await this.messageService.sendOTP({
        otp: otpCode,
        otpType: 'VERIFICATION',
        firstName,
        address: email,
      })
    }

    return {
      status: 'success',
      message: 'Account created successfully',
      data: {
        ...rest,
      },
    }
  }

  async validateUser({ email, password }: SignInDto): Promise<any> {
    const user = await this.prismaService.user.findFirst({ where: { email } })
    if (!user)
      throw new NotFoundException(`No user is registered with ${email} email`)

    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch)
      throw new BadRequestException('Invalid Email or Password')

    const { password: _, ...result } = user
    return result
    return null
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      UserType: user.userType,
    }

    return {
      status: 'success',
      message: 'User Logged in successfully',
      access_token: this.jwtService.sign(payload),
    }
  }

  // private method to create otp
  async #createOTP({
    type,
    email,
    phone,
    channelType,
    userType,
  }: CreateOTPDto) {
    const otpCode = generateOTP()
    let colSpecification = {},
      channelValue = 'EMAIL'
    if (channelType == 'EMAIL') {
      colSpecification = { email }
      channelValue = email
    } else {
      colSpecification = { phoneNumber: phone }
      channelValue = phone
    }

    const user =
      userType == 'CLIENT_USER'
        ? await this.prismaService.user.findFirst({
            where: { ...colSpecification },
          })
        : await this.prismaService.admin.findFirst({
            where: { ...colSpecification },
          })
    if (!user)
      throw new BadGatewayException(
        `Invalid ${channelType == 'EMAIL' ? 'email' : 'phone number'}`,
      )

    if ((user as any).profileLevel == 'VERIFIED' || type == 'VERIFICATION')
      throw new ConflictException('User is already verified ')

    const otpRecord = await this.prismaService.oTP.findFirst({
      where: { channelValue, type },
    })
    if (otpRecord)
      await this.prismaService.oTP.update({
        where: { id: otpRecord.id },
        data: {
          code: otpCode,
        },
      })
    else
      await this.prismaService.oTP.create({
        data: {
          code: otpCode,
          type,
          channelType,
          channelValue,
          userId: user.id,
        },
      })

    return { otpCode, type, channelValue, channelType, user }
  }
  // to request otp for verification and reset
  async requestOTP(createOTPDto: CreateOTPDto) {
    const { channelType, channelValue, otpCode, user, type } =
      await this.#createOTP(createOTPDto)

    // sending otp via appropriate channel
    channelType == 'EMAIL'
      ? this.messageService.setStrategy(this.emailStrategy)
      : this.messageService.setStrategy(this.smsStrategy)

    await this.messageService.sendOTP({
      otp: otpCode,
      otpType: type,
      firstName: user.firstName,
      address: channelValue,
    })

    return {
      status: 'success',
      message: `${type} OTP sent is to ${channelValue}  successfully  `,
      data: {
        otpCode,
        channelType,
        channelValue,
      },
    }
  }

  async verifyOTP({
    type,
    email,
    phone,
    otp: otpCode,
    channelType,
  }: VerifyOTPDto) {
    const channelValue = channelType == 'EMAIL' ? email : phone
    const otpRecord = await this.prismaService.oTP.findFirst({
      where: { type, channelValue },
    })

    if (!otpRecord) throw new NotFoundException('OTP not found')

    const currentTime = new Date()
    const expirationTime = new Date(otpRecord.updatedAt)
    expirationTime.setMinutes(
      expirationTime.getMinutes() +
        this.confgiService.get<number>('otp.expirationMinute'),
    )

    if (currentTime > expirationTime) {
      throw new BadRequestException('OTP has expired')
    }

    if (otpCode != otpRecord.code) {
      throw new BadRequestException('Invalid OTP')
    }

    await this.prismaService.oTP.update({
      where: { id: otpRecord.id },
      data: { isVerified: true },
    })

    return {
      status: 'success',
      message: 'OTP Verified',
    }
  }
  async verifyUser({ email, otp: otpCode }: VerifyUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    })

    if (!user) throw new BadRequestException('Invalid Email')
    const { status } = await this.verifyOTP({
      type: 'VERIFICATION',
      email,
      phone: '',
      channelType: 'EMAIL',
      otp: otpCode,
      userType: 'CLIENT_USER',
    })

    if (status != 'success')
      throw new BadRequestException('Unable to verify user ')

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { profileLevel: 'VERIFIED' },
    })
    await this.prismaService.oTP.deleteMany({
      where: { channelValue: email, type: 'VERIFICATION' },
    })
    return {
      status: 'success',
      message: 'User Verified successfully',
    }
  }
  async #checkOTPVerification({
    type,
    userId,
  }: {
    type: OTPType
    userId: string
  }) {
    const otpRecord = await this.prismaService.oTP.findFirst({
      where: { type, userId },
    })

    if (!otpRecord) throw new NotFoundException('OTP not found')

    const currentTime = new Date()
    const expirationTime = new Date(otpRecord.updatedAt)
    expirationTime.setMinutes(
      expirationTime.getMinutes() +
        this.confgiService.get<number>('otp.expirationMinute'),
    )
    if (currentTime > expirationTime)
      throw new BadRequestException('OTP has expired')

    if (!otpRecord.isVerified) throw new BadGatewayException('OTP not verified')
  }
  async updatePassword({ password, userId, userType }: UpdatePasswordDto) {
    const user =
      userType == 'CLIENT_USER'
        ? await this.prismaService.user.findUnique({
            where: { id: userId },
          })
        : await this.prismaService.admin.findUnique({
            where: { id: userId },
          })
    if (!user) throw new BadRequestException('Invalid user id ')

    await this.#checkOTPVerification({ type: 'VERIFICATION', userId })

    const hashedPassword = await bcrypt.hash(password, 12)

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })
    return {
      status: 'success',
      message: 'Password updated in successfully',
    }
  }
}
