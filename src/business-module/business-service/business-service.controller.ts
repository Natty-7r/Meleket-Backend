import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import {
  AddBusinessService,
  DeleteBusinessService,
  GetBusinessService,
  UpdateBusinessServices,
} from './decorators/business-service-endpoint.decorator'

import UpdateBusinessServicesDto from '../business-address/dto/update-business-services.dto'
import BusinessServiceService from './business-service.service'
import CreateBusinessServiceDto from './dto/create-business-service.dto'

@ApiTags('Business-service')
@Controller('business/services')
export default class BusinessServiceController {
  constructor(
    private readonly businessServiceService: BusinessServiceService,
  ) {}

  @Post()
  @AddBusinessService()
  async addBusinessService(
    @Body() createBusinessServiceDto: CreateBusinessServiceDto,
    @User() user: RequestUser,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.businessServiceService.addBussinessService({
      ...createBusinessServiceDto,
      image,
      userId: user.id,
    })
  }

  @Put('/:id')
  @UpdateBusinessServices()
  async updateBusinessServices(
    @Param('id') id: string,
    @Body() updateBusinessServiceDto: UpdateBusinessServicesDto,
    @User() user: RequestUser,
  ) {
    return this.businessServiceService.updateBusinessService({
      ...updateBusinessServiceDto,
      userId: user.id,
      id,
    })
  }

  @Delete('/:id')
  @DeleteBusinessService()
  deleteService(@Param('id') id: string, @User() { id: userId }: RequestUser) {
    return this.businessServiceService.deleteBusinessServices({
      userId,
      id,
    })
  }

  @Get()
  @GetBusinessService()
  getServices(@Param('businessId') businessId: string) {
    return this.businessServiceService.getBusinessServices({
      businessId,
    })
  }
}
