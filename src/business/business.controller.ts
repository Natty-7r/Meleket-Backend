import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
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
  UpdateBusinessServices,
  UpdateBusinessServiceImage,
  GetCategoryBusinesses,
  SearchBusiness,
  GetBusinesses,
  DeleteBusinessService,
  CreateBusinessAddress,
  UpdateBusinessAddress,
  DeleteBusinessAddress,
} from './decorators/business-endpoint.decorator'
import { USER } from 'src/common/util/types/base.type'
import User from 'src/common/decorators/user.decorator'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServiceDtos from './dto/update-business-service.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'

@ApiTags('Businesses')
@Controller('businesses')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @CreateBusiness()
  async createBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.createBusiness({
      ...createBusinessDto,
      userId: user.id,
      mainImage: file?.path || undefined,
    })
  }

  @Put('/image')
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
    return this.businessService.updateBusiness({
      ...updateBusinessDto,
      userId: user.id,
    })
  }

  // service related
  @Post('services')
  @AddBusinessService()
  async addBusinessService(
    @Body() createBusinessServiceDto: CreateBusinessServiceDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.addBussinessService({
      ...createBusinessServiceDto,
      imageUrl: file?.path || undefined,
      userId: user.id,
    })
  }

  @Put('services/image')
  @UpdateBusinessServiceImage()
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

  @Put('services')
  @UpdateBusinessServices()
  async updateBusinessServices(
    @Body() updateBusinessServiceDto: UpdateBusinessServiceDtos,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessServices({
      ...updateBusinessServiceDto,
      userId: user.id,
    })
  }
  @Delete('services/:id')
  @DeleteBusinessService()
  deleteService(@Param('id') id: string, @User() { id: userId }: USER) {
    return this.businessService.deleteBusinessServices({
      userId,
      id,
    })
  }

  // business address

  @Post('address')
  @CreateBusinessAddress()
  createBusinessAddress(
    @Body() createBusinessAddressDto: CreateBusinessAddressDto,
    @User() user: USER,
  ) {
    return this.businessService.createBusinessAddress({
      ...createBusinessAddressDto,
      userId: user.id,
    })
  }
  @Put('address')
  @UpdateBusinessAddress()
  updateBusinessAddress(
    @Body() updateBusinessAddressDto: UpdateBusinessAddressDto,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessAddress({
      ...updateBusinessAddressDto,
      userId: user.id,
    })
  }
  @Delete('address/:addressId')
  @DeleteBusinessAddress()
  deleteBusinessAddress(
    @Request() req: any,
    @Param('addressId') addressId: string,
    @User() user: USER,
  ) {
    return this.businessService.deleteBusinessAddress({
      id: addressId,
      userId: user?.id,
    })
  }

  @Get('all')
  @GetBusinesses()
  getAllBusiness() {
    return this.businessService.getAllBusiness()
  }

  @Get('/category')
  @GetCategoryBusinesses()
  getCategoryBusiness(@Param('categoryrId') categoryId: string) {
    return this.businessService.getCategoryBusiness({ categoryId })
  }

  @Get('search')
  @SearchBusiness()
  searchBusiness(@Query('searchKey') searchKey: string) {
    return this.businessService.searchBusiness({ searchKey })
  }
}
