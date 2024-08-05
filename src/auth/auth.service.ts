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

@Injectable()
export default class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
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
          signUpType == SignUpType.BY_EMAIL ? 'VERIFIED' : 'CREATED',
      },
    })

    const { password: _, ...rest } = userCreated
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
}
