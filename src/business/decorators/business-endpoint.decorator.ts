import { applyDecorators, UseInterceptors } from '@nestjs/common'
import Roles from 'src/common/decorators/roles.decorator'
import { CreateBussinessSwaggerDefinition } from './business-swagger.decorator'
import { FileInterceptor } from '@nestjs/platform-express'
import muluterStorage, { multerFilter } from 'src/common/util/helpers/multer'

export const CreateBusiness = () =>
  applyDecorators(
    Roles('CLIENT_USER'),
    UseInterceptors(
      FileInterceptor('image', {
        storage: muluterStorage({ folder: 'business', filePrefix: 'b' }),
        fileFilter: multerFilter({ fileType: 'image', maxSize: 5 }),
      }),
    ),
    CreateBussinessSwaggerDefinition(),
  )
