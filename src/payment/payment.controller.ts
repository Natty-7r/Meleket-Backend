import { Body, Controller, Get, Post, Put } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import User from 'src/common/decorators/user.decorator'
import { USER } from 'src/common/util/types/base.type'
import CreatePackageDto from './dto/create-package.dto'
import PaymentService from './payment.service'
import {
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
  @Post('package')
  createPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.paymentService.createPackage(createPackageDto)
  }

  @CreatePackage()
  @Put('package')
  updatePackage(@Body() updatePackageDto: UpdatePackageDto) {
    return this.paymentService.updatePackage(updatePackageDto)
  }

  @GetPackages()
  @Get('package/all')
  getPackages() {
    return this.paymentService.getPackages()
  }

  @PurchasePackage()
  @Post('business-package')
  purchasePackage(
    @Body() purchasePackageDto: PurchasePackageDto,
    @User() user: USER,
  ) {
    return this.paymentService.puchasePackage({
      ...purchasePackageDto,
      userId: user.id,
    })
  }
}
