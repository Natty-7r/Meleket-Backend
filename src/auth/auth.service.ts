import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { OTPType, Admin } from '@prisma/client'
import { RequestUser, SignUpType } from 'src/common/types/base.type'
import { generateOTP } from 'src/common/helpers/numbers.helper'
import MessageService from 'src/message/message.service'
import { ConfigService } from '@nestjs/config'
import EmailStrategy from 'src/message/strategies/email.strategy'
import { BaseIdParams } from 'src/common/types/params.type'
import LoggerService from 'src/logger/logger.service'
import {
  CreateAccountDto,
  CreateAdminDto,
  SignInDto,
  UpdateAdminStatusDto,
} from './dto'
import VerifyOTPDto from './dto/verify-otp.dto'
import CreateOTPDto from './dto/create-otp.dto'
import VerifyUserDto from './dto/verify-user.dto'
import SmsStrategy from '../message/strategies/sms.strategy'
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
    private readonly configService: ConfigService,
    private readonly loggerSerive: LoggerService,
  ) {
    // this.createSuperAdminAccount()
  }

  async createSuperAdminAccount() {
    const admins = await this.prismaService.admin.findMany({})
    if (admins.length === 0)
      this.createAdminAccount({
        firstName: this.configService
          .get<string>('superAdmin.firstName')
          .trim(),
        lastName: this.configService.get<string>('superAdmin.lastName').trim(),
        email: this.configService.get<string>('superAdmin.email').trim(),
        password: this.configService.get<string>('superAdmin.password').trim(),
        role: 'SUPER_ADMIN',
      })
  }

  async createUserAccount(
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
          signUpType === SignUpType.BY_EMAIL ? 'CREATED' : 'VERIFIED',
        roleId: '',
      },
    })
    /* eslint-disable */
    const { password: _, ...rest } = userCreated
    /* eslint-disable */
    if (signUpType === SignUpType.BY_EMAIL) {
      const { otpCode } = await this.createOTP({
        channelType: 'EMAIL',
        email,
        type: 'VERIFICATION',
        phone: '',
        userType: 'CLIENT_USER',
      })

      this.messageService.setStrategy(this.emailStrategy)
      this.messageService.sendOTP({
        otp: otpCode,
        otpType: 'VERIFICATION',
        firstName,
        address: email,
      })
    }
    this.loggerSerive.createLog({
      logType: 'USER_ACTIVITY',
      message: `user account created for ${email}, ${firstName}, ${lastName} with ID${rest.id}`,
      context: 'user account creation',
      userId: rest.id,
    })
    return {
      status: 'success',
      message: 'Account created successfully',
      data: {
        ...rest,
      },
    }
  }

  async createAdminAccount({
    firstName,
    lastName,
    email,
    password,
    role,
  }: CreateAdminDto) {
    const admin = await this.prismaService.admin.findFirst({ where: { email } })
    if (admin) throw new ConflictException('Email is already in use!')
    const hashedPassword = await bcrypt.hash(password, 12)

    const adminCreated = await this.prismaService.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        roleId: role,
        status: 'CREATED',
        inactiveReason: 'new account',
      },
    })

    this.messageService.setStrategy(this.emailStrategy)
    await this.messageService.sendAccountCreationMessage({
      firstName,
      password,
      address: email,
    })

    /* eslint-disable */
    const { password: _, ...rest } = adminCreated
    /* eslint-disable */

    this.loggerSerive.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: `${role == 'SUPER_ADMIN' && 'Super'} admin account created for email:${email}, name: ${firstName}, ${lastName} with ID ${rest.id}`,
      context: 'admin account creation',
      adminId: rest.id,
    })
    return {
      status: 'success',
      message: 'Admin created successfully',
      data: {
        ...rest,
      },
    }
  }

  async validateUser({ email, password }: SignInDto): Promise<any> {
    // let userType: UserType = 'CLIENT_USER'
    let user: RequestUser = await this.prismaService.user.findFirst({
      where: { email },
    })
    if (!user) {
      // userType = 'ADMIN'
      user = await this.prismaService.admin.findFirst({ where: { email } })
    }

    if (!user)
      throw new NotFoundException(`No user is registered with ${email} email`)

    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch)
      throw new BadRequestException('Invalid Email or Password')

    // if (userType !== 'CLIENT_USER' && (user as any).status !== 'ACTIVE')
    // throw new UnauthorizedException('Admin is Inactive currenlty ')
    /* eslint-disable */
    const { password: _, ...result } = user
    /* eslint-disable */
    return result
  }

  async login(user: RequestUser) {
    const payload = true
      ? {
          email: user.email,
          sub: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          // userType: user.userType,
        }
      : {
          email: user.email,
          sub: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          // userType: user.userType,
          status: (user as Admin).status,
        }

    if (payload?.status === 'CREATED' || payload?.status === 'INACTIVE')
      throw new ForbiddenException('User not active')
    return {
      status: 'success',
      message: 'User Logged in successfully',
      access_token: this.jwtService.sign(payload),
    }
  }

  // private method to create otp
  async createOTP({ type, email, phone, channelType, userType }: CreateOTPDto) {
    const otpCode = generateOTP()
    let colSpecification = {}
    let channelValue = 'EMAIL'
    if (channelType === 'EMAIL') {
      colSpecification = { email }
      channelValue = email
    } else {
      colSpecification = { phoneNumber: phone }
      channelValue = phone
    }

    const user =
      userType === 'CLIENT_USER'
        ? await this.prismaService.user.findFirst({
            where: { ...colSpecification },
          })
        : await this.prismaService.admin.findFirst({
            where: { ...colSpecification },
          })
    if (!user)
      throw new BadGatewayException(
        `Invalid ${channelType === 'EMAIL' ? 'email' : 'phone number'}`,
      )

    if ((user as any).profileLevel === 'VERIFIED' && type === 'VERIFICATION')
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
      await this.createOTP(createOTPDto)

    // sending otp via appropriate channel
    channelType === 'EMAIL'
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
    const channelValue = channelType === 'EMAIL' ? email : phone
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

    if (otpCode !== otpRecord.code) {
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

  async verifyAccount({ email, otp: otpCode }: VerifyUserDto) {
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

  async checkOTPVerification({
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
      userType === 'CLIENT_USER'
        ? await this.prismaService.user.findUnique({
            where: { id: userId },
          })
        : await this.prismaService.admin.findUnique({
            where: { id: userId },
          })
    if (!user) throw new BadRequestException('Invalid user id ')

    await this.checkOTPVerification({ type: 'RESET', userId })

    const hashedPassword = await bcrypt.hash(password, 12)

    if (userType === 'CLIENT_USER')
      await this.prismaService.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      })
    else {
      await this.prismaService.admin.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          // activating user when updating password
          status:
            (user as Admin).status === 'CREATED'
              ? 'ACTIVE'
              : (user as Admin).status,
          inactiveReason:
            (user as Admin).status === 'CREATED'
              ? ''
              : (user as Admin).inactiveReason,
        },
      })
    }
    this.loggerSerive.createLog({
      logType: userType === 'CLIENT_USER' ? 'USER_ACTIVITY' : 'ADMIN_ACTIVITY',
      message: `${userType == 'CLIENT_USER' ? 'user ' : 'admin'} with  id: ${user.id} name: ${user.firstName.concat(' ').concat(user.lastName)}  update password`,
      context: 'password update',
      userId: userType === 'CLIENT_USER' && user.id,
      adminId: userType !== 'CLIENT_USER' && user.id,
    })
    return {
      status: 'success',
      message: 'Password updated successfully',
    }
  }

  async getAdmins() {
    const admins = await this.prismaService.admin.findMany({})
    return {
      status: 'success',
      message: 'Admin fetched   successfully',
      data: admins,
    }
  }

  async updateAdminStatus({ id, status, reason }: UpdateAdminStatusDto) {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
    })
    if (!admin) throw new BadRequestException('Invalid admin id ')

    await this.prismaService.admin.update({
      where: { id },
      data: { status, inactiveReason: reason || '' },
    })
    return {
      status: 'success',
      message: 'Admin status updated  successfully',
    }
  }

  async deleteAdminAccount({ id }: BaseIdParams) {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
    })
    if (!admin) throw new BadRequestException('Invalid admin id ')

    await this.prismaService.admin.delete({
      where: { id },
    })
    return {
      status: 'success',
      message: 'Admin account deleted  successfully',
    }
  }
}
