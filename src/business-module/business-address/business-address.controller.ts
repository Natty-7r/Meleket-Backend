import {
  Body,
  Controller,
  Delete,
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
} from './decorators/business-endpoint.decorator'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
import BusinessAddressService from './business-address.service'

@ApiTags('Businesses-Address')
@Controller('businesses/addresses')
export default class BusinessAddressController {
  constructor(
    private readonly businessAddressService: BusinessAddressService,
  ) {}

  @Post()
  @CreateBusinessAddress()
  createBusinessAddress(
    @Body() createBusinessAddressDto: CreateBusinessAddressDto,
    @User() user: RequestUser,
  ) {
    return this.businessAddressService.createBusinessAddress({
      ...createBusinessAddressDto,
      userId: user.id,
    })
  }

  @Put()
  @UpdateBusinessAddress()
  updateBusinessAddress(
    @Body() updateBusinessAddressDto: UpdateBusinessAddressDto,
    @User() user: RequestUser,
  ) {
    return this.businessAddressService.updateBusinessAddress({
      ...updateBusinessAddressDto,
      userId: user.id,
    })
  }

  @Delete('/:id')
  @DeleteBusinessAddress()
  deleteBusinessAddress(
    @Request() req: any,
    @Param('id') id: string,
    @User() user: RequestUser,
  ) {
    return this.businessAddressService.deleteBusinessAddress({
      id,
      userId: user.id,
    })
  }

  @Delete('/:id')
  @DeleteBusinessAddress()
  getBusinessAddresses(
    @Request() req: any,
    @Param('businessId') businessId: string,
  ) {
    return this.businessAddressService.getBusinessAddresses({
      businessId,
    })
  }
}
