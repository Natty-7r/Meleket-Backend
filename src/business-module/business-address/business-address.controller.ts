import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestUser } from 'src/common/types/base.type'
import User from 'src/common/decorators/user.decorator'
import {
  CreateBusinessAddress,
  UpdateBusinessAddress,
  DeleteBusinessAddress,
  GetBusinessAddress,
} from './decorators/business-endpoint.decorator'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
import BusinessAddressService from './business-address.service'

@ApiTags('Businesses-Address')
@Controller('businesses')
export default class BusinessAddressController {
  constructor(
    private readonly businessAddressService: BusinessAddressService,
  ) {}

  @Post('/:id/addresses')
  @CreateBusinessAddress()
  createBusinessAddress(
    @Body() createBusinessAddressDto: CreateBusinessAddressDto,
    @User() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.businessAddressService.createBusinessAddress({
      ...createBusinessAddressDto,
      userId: user.id,
      businessId: id,
    })
  }

  @Put('addresses/:id')
  @UpdateBusinessAddress()
  updateBusinessAddress(
    @Body() updateBusinessAddressDto: UpdateBusinessAddressDto,
    @User() user: RequestUser,
    @Param('id') id: string,
  ) {
    return this.businessAddressService.updateBusinessAddress({
      ...updateBusinessAddressDto,
      userId: user.id,
      id,
    })
  }

  @Delete('addresses/:id')
  @DeleteBusinessAddress()
  deleteBusinessAddress(@Param('id') id: string, @User() user: RequestUser) {
    return this.businessAddressService.deleteBusinessAddress({
      id,
      userId: user.id,
    })
  }

  @Get('/:id/addresses')
  @GetBusinessAddress()
  getBusinessAddresses(@Param('id') businessId: string) {
    return this.businessAddressService.getBusinessAddresses({
      businessId,
    })
  }
}
