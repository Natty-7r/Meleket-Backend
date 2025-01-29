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
import { Admin, AuthProvider, OTPType, User } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import AccessControlService from 'src/access-control/access-control.service'
import AdminService from 'src/admin/admin.service'
import CreateAdminDto from 'src/admin/dto/create-admin-account.dto'
import { generateOTP } from 'src/common/helpers/numbers.helper'
import { removePassword } from 'src/common/helpers/parser.helper'
import { RequestUser, UserType } from 'src/common/types/base.type'
import {
  BaseAdminIdParams,
  BaseUserIdParams,
} from 'src/common/types/params.type'
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
import UpdateAuthProviderDto from './dto/update-auth-provider.dto'

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

  async createUserAccount({
    firstName,
    lastName,
    email,
    password,
    authProvider,
  }: CreateAccountDto & { authProvider: AuthProvider }) {
    const hashedPassword = await bcrypt.hash(password, 12)

    const userRole = await this.accessContolService.getUserRole()

    const userCreated = await this.userService.createUserAccount({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      roleId: userRole.id,
      authProvider,
    })
    if (authProvider === AuthProvider.LOCAL) {
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
    return removePassword(userCreated)
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
    return removePassword(adminAccount)
  }

  async checkEmail({
    email,
  }: {
    email: string
  }): Promise<{ user: User | Admin; userType: UserType }> {
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
    if (!user) return { user: null, userType: 'USER' }
    if (userType === 'ADMIN') return { user: user as Admin, userType }
    return { user: user as User, userType }
  }

  async validateUser({ email, password }: SignInDto): Promise<any> {
    const { user, userType } = await this.checkEmail({ email })
    if (!user) throw new NotFoundException(`Invalid Email or Password`)

    if (userType === 'USER') {
      if ((user as User).currentAuthMethod !== 'LOCAL')
        throw new UnauthorizedException(
          `User is using ${(user as User).currentAuthMethod} auth provider`,
        )
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password)
    if (!doesPasswordMatch)
      throw new BadRequestException('Invalid Email or Password')

    if (userType === 'ADMIN' && (user as Admin).status !== 'ACTIVE')
      throw new UnauthorizedException('Admin is Inactive currenlty ')
    return removePassword(user)
  }

  async login(user: RequestUser) {
    console.log(user)
    const payload = {
      email: user.email,
      id: user.id,
      sub: user.id,
    }

    if (user?.status === 'CREATED' || user?.status === 'INACTIVE')
      throw new UnauthorizedException('User not active')
    return {
      access_token: await this.jwtService.signAsync(payload),
      ...user,
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
      channelType,
      channelValue,
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
    return 'User Verified successfully'
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
    return 'Password updated successfully'
  }
  async updateAuthProvider({
    authMethod,
    password,
    userId,
  }: UpdateAuthProviderDto & BaseUserIdParams) {
    let data: any = { currentAuthMethod: authMethod }
    const user = await this.userService.checkUserId({ id: userId })
    if (authMethod === 'LOCAL' && !password)
      throw new BadRequestException('passowrd is needed for LOCAL auth method ')

    if (authMethod === 'LOCAL') data.password = await bcrypt.hash(password, 12)
    else if (user.authProvider !== authMethod)
      throw new BadRequestException(
        `only ${user.authProvider} is allowed for this user`,
      )

    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        passwordUpdatedAt: new Date(),
        updatedAt: new Date(),
        ...data,
      },
    })

    await this.loggerSerive.createLog({
      logType: 'USER_ACTIVITY',
      message: `user  with  id: ${user.id} name: ${user.firstName.concat(' ').concat(user.lastName)}  update auth method to ${authMethod}`,
      context: 'password update',
      userId,
    })
    return `auth methode updated to ${authMethod}`
  }
}
