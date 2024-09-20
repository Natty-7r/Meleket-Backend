import { applyDecorators } from '@nestjs/common'

import Roles from 'src/common/decorators/roles.decorator'
import { ViewLogsSwaggerDefinition } from './logger-swagger.decorator'
import Public from 'src/common/decorators/public.decorator'

export const ViewLogs = () =>
  applyDecorators(Public(), ViewLogsSwaggerDefinition())
