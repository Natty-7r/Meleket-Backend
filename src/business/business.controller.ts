import { Body, Controller, Param, Post, UploadedFile } from '@nestjs/common'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateBusiness,
  UpdateBusinessImage,
} from './decorators/business-endpoint.decorator'
import { USER } from 'src/common/util/types'
import User from 'src/common/decorators/user.decorator'

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
    @UploadedFile('image') image: Express.Multer.File,
  ) {
    return this.businessService.updateBusinessImage({
      id,
      imageUrl: image.path,
    })
  }
}
