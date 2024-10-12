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
import { RequestUser } from 'src/common/types/base.type'
import User from 'src/common/decorators/user.decorator'
import {
  AddBusinessService,
  UpdateBusinessServices,
  UpdateBusinessServiceImage,
  DeleteBusinessService,
  GetBusinessService,
} from './decorators/business-service-endpoint.decorator'

import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServicesDto from './dto/update-business-services.dto'
import BusinessServiceService from './business-service.service'

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
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessServiceService.addBussinessService({
      ...createBusinessServiceDto,
      imageUrl: file?.path || undefined,
      userId: user.id,
    })
  }

  @Put('/image')
  @UpdateBusinessServiceImage()
  async updateBusinessServiceImage(
    @Param('id') id: string,
    @User() user: RequestUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.businessServiceService.updateBusinessServiceImage({
      id,
      imageUrl: file.path,
      userId: user.id,
    })
  }

  @Put()
  @UpdateBusinessServices()
  async updateBusinessServices(
    @Body() updateBusinessServiceDto: UpdateBusinessServicesDto,
    @User() user: RequestUser,
  ) {
    return this.businessServiceService.updateBusinessServices({
      ...updateBusinessServiceDto,
      userId: user.id,
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
