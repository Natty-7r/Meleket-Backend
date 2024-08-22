import { Controller } from '@nestjs/common'
import CreateBusinessDto from './dto/create-business.dto'
import BusinessService from './business.service'
import { ApiTags } from '@nestjs/swagger'
import { CreateBusiness } from './decorator/business-endpoint.decorator'

@ApiTags('Business')
@Controller('business')
export default class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @CreateBusiness()
  async createBusiness(createBusinessDto: CreateBusinessDto) {
    return this.businessService.createBusiness(createBusinessDto)
  }
}
