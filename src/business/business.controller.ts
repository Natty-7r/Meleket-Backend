import { Body, Controller, UploadedFile } from '@nestjs/common'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateBusiness } from './decorator/business-endpoint.decorator'
import { USER } from 'src/common/util/types'
import User from 'src/common/decorators/user.decorator'

@ApiTags('Business')
@Controller('business')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @CreateBusiness()
  async createBusiness(
    @Body() createBusinessDto: CreateBusinessDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: USER,
  ) {
    return this.businessService.createBusiness(
      { ...createBusinessDto },
      user.id,
      file?.path || undefined,
    )
  }
}
