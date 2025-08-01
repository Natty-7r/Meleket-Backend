import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PaymentMethod } from '@prisma/client'
import BusinessService from 'src/business-module/business/business.service'
import { MAX_ACTIVE_BUSINESS_COUNT } from 'src/common/constants/base.constants'
import {
  calculatePackageExpireDate,
  calculatePackageStartDate,
} from 'src/common/helpers/date.helper'
import { generatePackageCode } from 'src/common/helpers/string.helper'
import {
  PaymentInitResponse,
  PaymentSuccessResponse,
} from 'src/common/types/base.type'
import {
  AdminIdParams,
  BaseNameParams,
  BusinessIdParams,
  PackageIdParams,
  UserIdParams,
} from 'src/common/types/params.type'
import LoggerService from 'src/logger/logger.service'
import PrismaService from 'src/prisma/prisma.service'
import UserService from 'src/user/user.service'
import CreatePackageDto from './dto/create-package.dto'
import PurchasePackageDto from './dto/purchase-package.dto'
import UpdatePackageDto from './dto/update-package.dto'
import Chapa from './payment-strategies/chapa.strategy'
import Stripe from './payment-strategies/stripe.strategry'

@Injectable()
export default class PaymentService {
  constructor(
    private readonly chapa: Chapa,
    private readonly stripe: Stripe,
    private readonly businsesService: BusinessService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly loggerService: LoggerService,
  ) {}

  private async checkUnBilledPackage({ businessId }: BusinessIdParams) {
    const unbilledPackages = await this.prismaService.businessPackage.findMany({
      where: {
        AND: [
          { businessId },
          {
            OR: [
              {
                billed: false,
              },
              {
                billId: null,
              },
            ],
          },
        ],
      },
    })
    if (unbilledPackages && unbilledPackages.length > 0)
      throw new BadRequestException(
        'You have unbilled package please pay or clear it first ',
      )
  }

  private async getLastActivePackageExpiredDate({
    businessId,
  }: BusinessIdParams): Promise<Date> {
    const billedPackages = await this.prismaService.businessPackage.findMany({
      where: {
        AND: [
          { businessId },
          {
            OR: [
              {
                billed: true,
              },
              {
                billId: {
                  not: null,
                },
              },
            ],
          },
        ],
      },
    })
    if (billedPackages && billedPackages.length > MAX_ACTIVE_BUSINESS_COUNT)
      throw new BadRequestException(
        `Bussiness can't have more than ${MAX_ACTIVE_BUSINESS_COUNT} active packages`,
      )

    if (billedPackages.length === 0) {
      return undefined // Return undefined if the array is empty
    }
    return billedPackages[billedPackages.length - 1].expreDate
  }

  private async verifyPackageId({ packageId }: PackageIdParams) {
    const previousPackage = await this.prismaService.package.findFirst({
      where: { id: packageId },
    })
    if (!previousPackage) throw new BadRequestException('Invlalid Package Id')
  }

  private async verifyPackageName({ name }: BaseNameParams) {
    const previousPackage = await this.prismaService.package.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    })
    if (previousPackage)
      throw new BadRequestException('Package with that name exists')
  }

  private async getPackagesCount(): Promise<number> {
    return this.prismaService.package.count()
  }

  async createPackage({
    name,
    price,
    monthCount,
    description,
    adminId,
  }: CreatePackageDto & AdminIdParams) {
    await this.verifyPackageName({ name })
    const packagesCount = await this.getPackagesCount()

    const packageCode = generatePackageCode(packagesCount, name)
    const packageCreated = await this.prismaService.package.create({
      data: {
        name,
        price,
        monthCount,
        description,
        code: packageCode,
      },
    })
    this.loggerService.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: 'Package created',
      context: `name: ${name} ID: ${packageCreated.id} `,
      adminId,
    })
    return packageCreated
  }

  async updatePackage({
    id,
    adminId,
    ...updatePackgeDto
  }: UpdatePackageDto & AdminIdParams) {
    await this.verifyPackageId({ packageId: id })

    const updatedPackage = await this.prismaService.package.update({
      where: { id },
      data: {
        ...updatePackgeDto,
      },
    })
    this.loggerService.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: 'Package updated',
      context: `name: ${updatePackgeDto.name} ID: ${updatedPackage.id} `,
      adminId,
    })
    return updatedPackage
  }

  async getPackages() {
    return this.prismaService.package.findMany()
  }

  async puchasePackage({
    businessId,
    packageId,
    userId,
    paymentMethod,
    callbackUrl,
  }: PurchasePackageDto & UserIdParams) {
    let paymentDetail: PaymentInitResponse

    await this.verifyPackageId({ packageId })
    await this.businsesService.verifiyBusinessId({ id: businessId })
    await this.checkUnBilledPackage({ businessId })
    const lastPackageExpireData: Date =
      await this.getLastActivePackageExpiredDate({
        businessId,
      })
    const businessDetail = await this.businsesService.getBusinessPackageDetail({
      businessId,
    })
    const packageDetail = await this.prismaService.package.findFirst({
      where: { id: packageId },
    })
    const packageAmount = businessDetail.category.price * packageDetail.price

    const user = await this.userService.checkUserId({ id: userId })
    if (paymentMethod === 'CHAPA') {
      const { status, message, data } = await this.chapa.initialize({
        user: user as any,
        amount: packageAmount,
        callbackUrl,
      })
      if (status === 'fail')
        throw new InternalServerErrorException(`Payemnt error:${message}`)
      paymentDetail = data
    }
    if (paymentMethod === 'STRIPE') {
      const { status, message, data } = await this.stripe.createCheckoutSession(
        {
          amount: packageAmount,
          productName: packageDetail.name,
          callbackUrl,
        },
      )
      if (status === 'fail')
        throw new InternalServerErrorException(`Payemnt error:${message}`)
      paymentDetail = data
    }

    const businessPackage = await this.prismaService.businessPackage.create({
      data: {
        businessId,
        startDate: calculatePackageStartDate(lastPackageExpireData || null),
        expreDate: calculatePackageExpireDate(packageDetail.monthCount),
        packageId: packageDetail.id,
        reference: paymentDetail.reference,
        sessionId: paymentDetail.sessionId,
        amount: packageAmount,
      },
    })

    return {
      package: businessPackage,
      payment: paymentDetail,
    }
  }

  async verifyPayment(reference: string, userId: string) {
    const boughtPackage = await this.prismaService.businessPackage.findFirst({
      where: { reference },
    })
    if (!boughtPackage) throw new NotFoundException('Invalid refrence value')
    if (boughtPackage.billed) return boughtPackage

    let paymentMethod: PaymentMethod, paymnetDetail: PaymentSuccessResponse

    if (!boughtPackage.sessionId) {
      const { isExprired, ...rest } = await this.chapa.verify(reference)
      paymentMethod = 'CHAPA'
      paymnetDetail = rest
    }
    if (boughtPackage.sessionId) {
      const { isExprired, ...rest } = await this.stripe.verify(
        boughtPackage.sessionId,
      )
      paymentMethod = 'STRIPE'
      paymnetDetail = rest
      if (isExprired) {
        await this.prismaService.businessPackage.delete({
          where: { id: boughtPackage.id },
        })
        throw new BadRequestException('Payment expired recreate the package')
      }
    }

    const packageBill = await this.prismaService.bill.create({
      data: {
        businessId: boughtPackage.businessId,
        paymentMethod,
        userId,
        reference,
        ...paymnetDetail,
      },
    })

    const billedPackage = await this.prismaService.businessPackage.update({
      where: { id: boughtPackage.id },
      data: {
        billId: packageBill.id,
        billed: true,
      },
      select: {
        id: true,
        reference: true,
        package: {
          select: { id: true, name: true, monthCount: true, price: true },
        },
        business: {
          select: { id: true, name: true },
        },
        bill: {
          select: { id: true, amount: true, paymentMethod: true },
        },
      },
    })

    this.loggerService.createLog({
      logType: 'USER_ACTIVITY',
      message: `Package billed with ${paymentMethod}`,
      context: `bussinesPackageId: ${boughtPackage.id} businessId: ${boughtPackage.businessId} amount: ${packageBill.amount} billId: ${packageBill.id} userId: ${userId}`,
    })

    return billedPackage
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearUnbilledPackages() {
    const oneDayAgo = new Date()
    oneDayAgo.setDate(oneDayAgo.getDate() - 1)

    await this.prismaService.businessPackage.deleteMany({
      where: {
        AND: [{ billed: false }, { createdAt: { lte: oneDayAgo } }],
      },
    })
    this.loggerService.createLog({
      logType: 'SYSTEM_ACTIVITY',
      message: 'unbilled packages clead',
      context: `Date: ${oneDayAgo.toLocaleString()} `,
    })
  }
}
