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
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import BusinessService from './business.service'
import {
  CreateBusiness,
  GetBusinesses,
  UpdateBusiness,
  UpdateBusinessContact,
} from './decorators/business-endpoint.decorator'
import BusinessQueryDto from './dto/business-query.dto'
import CreateBusinessDto from './dto/create-business.dto'
import UpdateBusinessContactDto from './dto/update-business-contact.dto'
import UpdateBusinessDto from './dto/update-business.dto'

@ApiTags('Businesses')
@Controller('businesses')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @GetBusinesses()
  getAllBusiness(@Query() query: BusinessQueryDto) {
    return this.businessService.getAllBusinesses(query)
  }

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

  @Put('/:id')
  @UpdateBusiness()
  async updateBusiness(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @User() user: RequestUser,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.businessService.updateBusiness({
      ...updateBusinessDto,
      userId: user.id,
      id,
      image,
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
}
