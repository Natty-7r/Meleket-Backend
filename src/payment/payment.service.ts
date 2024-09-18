import { BadRequestException, Injectable } from '@nestjs/common'
import BusinessService from 'src/business/business.service'
import {
  BaseNameParams,
  BusinessIdParams,
  PackageIdParams,
  UserIdParams,
} from 'src/common/util/types/params.type'
import PrismaService from 'src/prisma/prisma.service'
import { generatePackageCode } from 'src/common/util/helpers/string-util'
import UserService from 'src/user/user.service'
import { ChapaCustomerInfo } from 'src/common/util/types/base.type'
import CreatePackageDto from './dto/create-package.dto'
import PurchasePackageDto from './dto/purchase-package.dto'
import Chapa from './payment-strategies/chapa.strategy'
import UpdatePackageDto from './dto/update-package.dto'

@Injectable()
export default class PaymentService {
  constructor(
    private readonly chapa: Chapa,
    private readonly businsesService: BusinessService,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
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

  private async verifyPackageId({ packageId }: PackageIdParams) {
    const previousPackage = await this.prismaService.package.findFirst({
      where: { id: packageId },
    })
    if (!previousPackage) throw new BadRequestException('Invlalid Package Id')
  }

  private async verifyPackageName({ name }: BaseNameParams) {
    const previousPackage = await this.prismaService.package.findFirst({
      where: { name },
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
  }: CreatePackageDto) {
    await this.verifyPackageName({ name })
    const packagesCount = await this.getPackagesCount()

    const packageCode = generatePackageCode(packagesCount, name)
    console.log(packagesCount, packageCode)
    const packageCreated = await this.prismaService.package.create({
      data: {
        name,
        price,
        monthCount,
        description,
        code: packageCode,
      },
    })
    return {
      status: 'success',
      message: 'packages fetched successfully',
      data: packageCreated,
    }
  }

  async updatePackage({ id, ...updatePackgeDto }: UpdatePackageDto) {
    await this.verifyPackageId({ packageId: id })

    const updatedPackage = await this.prismaService.package.update({
      where: { id },
      data: {
        ...updatePackgeDto,
      },
    })
    return {
      status: 'success',
      message: 'packages updated successfully',
      data: updatedPackage,
    }
  }

  async getPackages() {
    const packages = await this.prismaService.package.findMany()

    return {
      status: 'success',
      message: 'packages fetched successfully',
      data: packages,
    }
  }

  async puchasePackage({
    businessId,
    packageId,
    userId,
  }: PurchasePackageDto & UserIdParams) {
    await this.verifyPackageId({ packageId })
    await this.businsesService.verifiyBusinessId({ id: businessId })
    const businessDetail = await this.businsesService.getBusinessPackageDetail({
      businessId,
    })
    const packageDetail = await this.prismaService.package.findFirst({
      where: { id: packageId },
    })
    const packageAmount =
      businessDetail.category.price *
      packageDetail.price *
      packageDetail.monthCount

    const { data } = await this.userService.getUserDetail({ id: userId })
    const chapaCustomerInfo: ChapaCustomerInfo = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      currency: 'ETB',
      amount: packageAmount,
    }
    console.log(chapaCustomerInfo)
  }
}
