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
  GetUserBusinesses,
  SearchBusinessByAddress,
  DeleteBusinessService,
  CreateBusinessAddress,
  UpdateBusinessAddress,
  DeleteBusinessAddress,
} from './decorators/business-endpoint.decorator'
import { USER } from 'src/common/util/types'
import User from 'src/common/decorators/user.decorator'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServiceDtos from './dto/update-business-service.dto'
import UpdateBusinessDto from './dto/update-business.dto'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'

@ApiTags('Business')
@Controller('business')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('create-business')
  @CreateBusiness()
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

  @Put('update-business-image')
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

  @Put('update-buinesss')
  @UpdateBusiness()
  async updateBusiness(
    @Body() updateBusinessDto: UpdateBusinessDto,
    @User() user: USER,
  ) {
    return this.businessService.updateBusiness(updateBusinessDto, user.id)
  }

  // service related
  @Post('add-business')
  @AddBusinessService()
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

  @Put('update-business-service-image')
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

  @Put('update-services')
  @UpdateBusinessServices()
  async updateBusinessServices(
    @Body() updateBusinessServiceDto: UpdateBusinessServiceDtos,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessServices(
      updateBusinessServiceDto,

      user.id,
    )
  }
  @Delete()
  @DeleteBusinessService()
  deleteService(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @User() { id: userId }: USER,
  ) {
    return this.businessService.deleteBusinessServices({
      userId,
      id,
      businessId,
    })
  }

  @Get('user')
  @GetUserBusinesses()
  getUserBusiness() {
    return this.businessService.getAllBusiness()
  }

  @Get('all')
  @GetBusinesses()
  getAllBusiness() {
    return this.businessService.getAllBusiness()
  }

  @Get('category')
  @GetCategoryBusinesses()
  getCategoryBusiness(@Param('categoryrId') categoryId: string) {
    return this.businessService.getCategoryBusiness({ categoryId })
  }

  @Get('search')
  @SearchBusiness()
  searchBusiness(@Query('searchKey') searchKey: string) {
    return this.businessService.searchBusiness(searchKey)
  }

  @Get('search')
  @SearchBusinessByAddress()
  searchBusinessByAddress(@Query('address') address: string) {
    return this.businessService.searchBusinessBYAddress(address)
  }

  // business address

  @Post('create-address')
  @CreateBusinessAddress()
  createBusinessAddress(
    @Body() createBusinessAddressDto: CreateBusinessAddressDto,
    @User() user: USER,
  ) {
    return this.businessService.createBusinessAddress(
      createBusinessAddressDto,
      user.id,
    )
  }
  @Put('update-address')
  @UpdateBusinessAddress()
  updateBusinessAddress(
    @Body() updateBusinessAddressDto: UpdateBusinessAddressDto,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessAddress(
      updateBusinessAddressDto,
      user.id,
    )
  }
  @Delete('delete-address/:addressId')
  @DeleteBusinessAddress()
  deleteBusinessAddress(
    @Request() req: any,
    @Param('addressId') addressId: string,
    @User() user: USER,
  ) {
    console.log(addressId)
    return this.businessService.deleteBusinessAddress({
      id: addressId,
      userId: user?.id,
    })
  }
}
