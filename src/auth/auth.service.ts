import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Admin, OTPType, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import AccessControlService from 'src/access-control/access-control.service'
import AdminService from 'src/admin/admin.service'
import CreateAdminDto from 'src/admin/dto/create-admin-account.dto'
import { generateOTP } from 'src/common/helpers/numbers.helper'
import { removePassword } from 'src/common/helpers/parser.helper'
import { RequestUser, SignUpType, UserType } from 'src/common/types/base.type'
import { BaseAdminIdParams } from 'src/common/types/params.type'
import LoggerService from 'src/logger/logger.service'
import MessageService from 'src/message/message.service'
import EmailStrategy from 'src/message/strategies/email.strategy'
import PrismaService from 'src/prisma/prisma.service'
import UserService from 'src/user/user.service'
import SmsStrategy from '../message/strategies/sms.strategy'
import { CreateAccountDto, SignInDto } from './dto'
import CreateOTPDto from './dto/create-otp.dto'
import UpdatePasswordDto from './dto/update-passowrd.dto'
import VerifyOTPDto from './dto/verify-otp.dto'
import VerifyUserDto from './dto/verify-user.dto'

@Injectable()
export default class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly confgiService: ConfigService,
    private readonly smsStrategy: SmsStrategy,
    private readonly emailStrategy: EmailStrategy,
    private readonly loggerSerive: LoggerService,
    private readonly accessContolService: AccessControlService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

  async createUserAccount(
    { firstName, lastName, email, password }: CreateAccountDto,
    signUpType: SignUpType,
  ) {
    const hashedPassword = await bcrypt.hash(password, 12)

    const userRole = await this.accessContolService.getUserRole()

    const userCreated = await this.userService.createUserAccount({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    })
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
      message: `user account created for ${email}, ${firstName}, ${lastName} with ID${userCreated.id}`,
      context: 'user account creation',
      userId: userCreated.id,
    })
    return {
      status: 'success',
      message: 'Account created successfully',
      data: removePassword(userCreated),
    }
  }

  async createAdminAccount({
    roleId,
    password,
    email,
    firstName,
    lastName,
  }: CreateAdminDto & BaseAdminIdParams) {
    const adminRole = await this.accessContolService.getAdminRole({
      roleId,
    })

    const hashedPassword = await bcrypt.hash(password, 12)

    const adminAccount = await this.adminService.createAdminAccount({
      firstName,
      lastName,
      email,
      roleId: adminRole.id,
      password: hashedPassword,
    })

    this.messageService.setStrategy(this.emailStrategy)
    await this.messageService.sendAccountCreationMessage({
      firstName,
      password,
      address: email,
    })

    this.loggerSerive.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: ` admin account created for email:${email}, name: ${firstName}, ${lastName} with ID ${adminAccount.id}`,
      context: 'admin account creation',
      adminId: adminAccount.id,
    })
    return {
      status: 'success',
      message: 'Admin created successfully',
      data: removePassword(adminAccount),
    }
  }

  async validateUser({ email, password }: SignInDto): Promise<any> {
    let userType: UserType = 'USER'
    let user: User | Admin

    user = await this.prismaService.user.findFirst({
      where: { email },
      include: { role: { select: { id: true, name: true } } },
    })
    if (!user) {
      userType = 'ADMIN'
      user = await this.prismaService.admin.findFirst({
        where: { email },
        include: { role: { select: { id: true, name: true } } },
      })
    }
    if (!user) throw new NotFoundException(`Invalid Email or Password`)

    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch)
      throw new BadRequestException('Invalid Email or Password')

    if (userType === 'ADMIN' && (user as Admin).status !== 'ACTIVE')
      throw new UnauthorizedException('Admin is Inactive currenlty ')
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
        }
      : {
          email: user.email,
          sub: user.id,
        }

    if (user?.status === 'CREATED' || user?.status === 'INACTIVE')
      throw new UnauthorizedException('User not active')
    return {
      status: 'success',
      message: 'User Logged in successfully',
      access_token: this.jwtService.sign(payload),
      data: user,
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
        // otpCode,
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
      data: { status: 'ACTIVE' },
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
          inActiveReason:
            (user as Admin).status === 'CREATED'
              ? ''
              : (user as Admin).inActiveReason,
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
}
