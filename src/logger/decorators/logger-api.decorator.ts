import { applyDecorators } from '@nestjs/common'

import Roles from 'src/common/decorators/roles.decorator'
import { ViewLogsSwaggerDefinition } from './logger-swagger.decorator'

export const ViewLogs = () =>
  applyDecorators(Roles('ADMIN', 'SUPER_ADMIN'), ViewLogsSwaggerDefinition())
