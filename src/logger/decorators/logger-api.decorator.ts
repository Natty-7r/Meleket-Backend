import { applyDecorators } from '@nestjs/common'

import Roles from 'src/common/decorators/roles.decorator'
import {
  ArchiveLogsSwaggerDefinition,
  ViewFileLogsSwaggerDefinition,
  ViewLogsSwaggerDefinition,
} from './logger-swagger.decorator'

export const ViewLogs = () =>
  applyDecorators(Roles('ADMIN', 'SUPER_ADMIN'), ViewLogsSwaggerDefinition())

export const ViewFileLogs = () =>
  applyDecorators(
    Roles('ADMIN', 'SUPER_ADMIN'),
    ViewFileLogsSwaggerDefinition(),
  )

export const ArchiveLogs = () =>
  applyDecorators(Roles('SUPER_ADMIN'), ArchiveLogsSwaggerDefinition())
