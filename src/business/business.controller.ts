import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
} from '@nestjs/common'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import { ApiTags } from '@nestjs/swagger'
import {
  AddBusinessService,
  CreateBusiness,
  UpdateBusiness,
  UpdateBusinessImage,
  UpdateBusinessService,
  UpdateBusinessServiceImage,
} from './decorators/business-endpoint.decorator'
import { USER } from 'src/common/util/types'
import User from 'src/common/decorators/user.decorator'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServiceDtos, {
  UpdateBusinessServiceDto,
} from './dto/update-business-service.dto'
import UpdateBusinessDto from './dto/update-business.dto'

@ApiTags('Business')
@Controller('business')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @CreateBusiness()
  @Post()
  async createBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.createBusiness(
      { ...createBusinessDto },
      user.id,
      file?.path || undefined,
    )
  }

  @Post()
  @UpdateBusinessImage()
  async updateBusinessImage(
    @Param('id') id: string,
    @User() user: USER,
    @UploadedFile('image') image: Express.Multer.File,
  ) {
    return this.businessService.updateBusinessImage({
      id,
      imageUrl: image.path,
      userId: user.id,
    })
  }

  @Put()
  @UpdateBusiness()
  async updateBusiness(
    @Body() updateBusinessDto: UpdateBusinessDto,
    @User() user: USER,
  ) {
    return this.businessService.updateBusiness(updateBusinessDto, user.id)
  }

  @AddBusinessService()
  @Post()
  async addBusinessService(
    @Body() createBusinessServiceDto: CreateBusinessServiceDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.addBussinessService(
      { ...createBusinessServiceDto },
      user.id,
      file?.path || undefined,
    )
  }

  @UpdateBusinessServiceImage()
  @Put()
  async updateBusinessServiceImage(
    @Param('id') id: string,
    @User() user: USER,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.businessService.updateBusinessServiceImage({
      id,
      imageUrl: file.path,
      userId: user.id,
    })
  }

  @UpdateBusinessService()
  @Put()
  async updateBusinessService(
    @Body() updateBusinessServiceDto: UpdateBusinessServiceDtos,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessServices(
      updateBusinessServiceDto,

      user.id,
    )
  }
}
