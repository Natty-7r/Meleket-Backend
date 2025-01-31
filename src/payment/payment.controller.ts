import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import CreatePackageDto from './dto/create-package.dto'
import PaymentService from './payment.service'
import {
  BillPackage,
  CreatePackage,
  GetPackages,
  PurchasePackage,
} from './decorators/payment-api.decorator'
import UpdatePackageDto from './dto/update-package.dto'
import PurchasePackageDto from './dto/purchase-package.dto'

@ApiTags('Payment')
@Controller('payment')
export default class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @CreatePackage()
  @Post('packages')
  createPackage(
    @Body() createPackageDto: CreatePackageDto,
    @User() user: RequestUser,
  ) {
    return this.paymentService.createPackage({
      ...createPackageDto,
      adminId: user.id,
    })
  }

  @CreatePackage()
  @Put('packages')
  updatePackage(
    @Body() updatePackageDto: UpdatePackageDto,
    @User() user: RequestUser,
  ) {
    return this.paymentService.updatePackage({
      ...updatePackageDto,
      adminId: user.id,
    })
  }

  @GetPackages()
  @Get('packages')
  getPackages() {
    return this.paymentService.getPackages()
  }

  @PurchasePackage()
  @Post('business-packages')
  purchasePackage(
    @Body() purchasePackageDto: PurchasePackageDto,
    @User() user: RequestUser,
  ) {
    return this.paymentService.puchasePackage({
      ...purchasePackageDto,
      userId: user.id,
    })
  }

  @BillPackage()
  @Put('/:reference')
  chapaCallback(
    @Param('reference') reference: string,
    @User() user: RequestUser,
  ) {
    return this.paymentService.verifyPayment(reference, user.id)
  }
}
