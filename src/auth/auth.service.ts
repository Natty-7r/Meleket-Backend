import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { User } from '@prisma/client'
import { CreateAccountDto, SignInDto } from './dto'
import { SignUpType } from 'src/common/util/types'
import { generateOTP } from 'src/common/util/helpers/numbers'
import MessageService from 'src/message/message.service'
import VerifyOTPDto from './dto/verify-otp.dto'
import { ConfigService } from '@nestjs/config'
import CreateOTPDto from './dto/create-otp.dto'

@Injectable()
export default class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly confgiService: ConfigService,
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
        type: 'VERFICATION',
        phone: '',
      })

      await this.messageService.sendVerificationOTPEmail({
        channelValue: email,
        otp: otpCode,
        firstName,
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

  async #createOTP({ type, email, phone, channelType }: CreateOTPDto) {
    const otpCode = generateOTP()
    const channelValue = channelType == 'EMAIL' ? email : phone
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
        },
      })

    return { otpCode, type, channelValue, channelType }
  }

  async requestOTP(createOTPDto: CreateOTPDto) {
    const { channelType, channelValue, otpCode } =
      await this.#createOTP(createOTPDto)
    return {
      status: 'success',
      message: 'OTP Created successfully',
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
    const otpRecord = await this.prismaService.oTP.findFirst({
      where: { type, channelValue: channelType == 'EMAIL' ? email : phone },
    })

    if (!otpRecord) {
      throw new NotFoundException('OTP not found')
    }

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
}
