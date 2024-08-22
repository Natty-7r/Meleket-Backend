import { applyDecorators } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import { CreateBussinessSwaggerDefinition } from './business-swagger.decorator'

export const CreateBusiness = () =>
  applyDecorators(Roles('CLIENT_USER'), CreateBussinessSwaggerDefinition())
