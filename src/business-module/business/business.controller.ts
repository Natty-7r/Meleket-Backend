import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RequestUser } from 'src/common/types/base.type'
import User from 'src/common/decorators/user.decorator'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import {
  CreateBusiness,
  UpdateBusiness,
  UpdateBusinessImage,
  SearchBusiness,
  GetBusinesses,
  UpdateBusinessContact,
} from './decorators/business-endpoint.decorator'
import UpdateBusinessDto from './dto/update-business.dto'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'

@ApiTags('Businesses')
@Controller('businesses')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @CreateBusiness()
  async createBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @User() user: RequestUser,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.businessService.createBusiness({
      ...createBusinessDto,
      userId: user.id,
      mainImage: image?.path || undefined,
    })
  }

  @Put('/image')
  @UpdateBusinessImage()
  async updateBusinessImage(
    @Param('id') id: string,
    @User() user: RequestUser,
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
    @User() user: RequestUser,
  ) {
    return this.businessService.updateBusiness({
      ...updateBusinessDto,
      userId: user.id,
    })
  }

  @Put('contact')
  @UpdateBusinessContact()
  updateBusinessContact(
    @Body() updateBusinessContactDto: UpdateBusinessContactDto,
    @User() user: RequestUser,
  ) {
    return this.businessService.updateBusinessContact({
      ...updateBusinessContactDto,
      userId: user.id,
    })
  }

  @Get()
  @GetBusinesses()
  getAllBusiness() {
    return this.businessService.getAllBusinesses()
  }

  @Get('search')
  @SearchBusiness()
  searchBusiness(@Query('searchKey') searchKey: string) {
    return this.businessService.searchBusinesses({ searchKey })
  }
}
