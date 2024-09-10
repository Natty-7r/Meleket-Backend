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
import { ApiTags } from '@nestjs/swagger'
import { USER } from 'src/common/util/types/base.type'
import User from 'src/common/decorators/user.decorator'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import {
  AddBusinessService,
  CreateBusiness,
  UpdateBusiness,
  UpdateBusinessImage,
  UpdateBusinessServices,
  UpdateBusinessServiceImage,
  SearchBusiness,
  GetBusinesses,
  DeleteBusinessService,
  CreateBusinessAddress,
  UpdateBusinessAddress,
  DeleteBusinessAddress,
  UpdateBusinessContact,
  AddStory,
  UpdateStory,
  DeleteStory,
  GetBusinessStories,
  GetAllStories,
} from './decorators/business-endpoint.decorator'
import UpdateBusinessDto from './dto/update-business.dto'
import CreateBusinessAddressDto from './dto/create-business-address.dto'
import UpdateBusinessAddressDto from './dto/update-business-address.dto'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'
import CreateStoryDto from './dto/create-story.dto'
import UpdateStoryDto from './dto/update-store.dto'
import CreateBusinessServiceDto from './dto/create-business-service.dto'
import UpdateBusinessServicesDto from './dto/update-business-services.dto'

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
    @Body() updateBusinessServiceDto: UpdateBusinessServicesDto,
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

  @Delete('address/:id')
  @DeleteBusinessAddress()
  deleteBusinessAddress(
    @Request() req: any,
    @Param('id') id: string,
    @User() user: USER,
  ) {
    return this.businessService.deleteBusinessAddress({
      id,
      userId: user?.id,
    })
  }

  @Put('contact')
  @UpdateBusinessContact()
  updateBusinessContact(
    @Body() updateBusinessContactDto: UpdateBusinessContactDto,
    @User() user: USER,
  ) {
    return this.businessService.updateBusinessContact({
      ...updateBusinessContactDto,
      userId: user.id,
    })
  }

  @Get('all')
  @GetBusinesses()
  getAllBusiness() {
    return this.businessService.getAllBusinesses()
  }

  @Get('search')
  @SearchBusiness()
  searchBusiness(@Query('searchKey') searchKey: string) {
    return this.businessService.searchBusinesses({ searchKey })
  }

  // story related

  @Post('stories')
  @AddStory()
  async addStory(
    @Body() createStoryDto: CreateStoryDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.addStory({
      ...createStoryDto,
      userId: user.id,
      image: file?.path || undefined,
    })
  }

  @Put('stories')
  @UpdateStory()
  async updateStory(
    @Body() updateStoryDto: UpdateStoryDto,
    @User() user: USER,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.businessService.updateStory({
      ...updateStoryDto,
      userId: user.id,
      image: file?.path || undefined,
    })
  }

  @Delete('stories/:id')
  @DeleteStory()
  async deleteStory(@Param('id') id: string, @User() user: USER) {
    return this.businessService.deleteStory({
      userId: user.id,
      id,
    })
  }

  @Get('stories')
  @GetAllStories()
  async fetchAllStories() {
    return this.businessService.getStories()
  }

  @Get('stories/:businessId')
  @GetBusinessStories()
  async getStories(@Param('businessId') businessId: string) {
    return this.businessService.getBusinessStories({ businessId })
  }
}
