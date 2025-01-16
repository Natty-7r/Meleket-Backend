import { applyDecorators } from '@nestjs/common'

import {
  ArchiveLogsSwaggerDefinition,
  ViewFileLogsSwaggerDefinition,
  ViewLogsSwaggerDefinition,
} from './logger-swagger.decorator'
import Permissions from 'src/common/decorators/permission.decorator'

export const ViewLogs = () =>
  applyDecorators(Permissions(), ViewLogsSwaggerDefinition())

export const ViewFileLogs = () =>
  applyDecorators(Permissions(), ViewFileLogsSwaggerDefinition())

export const ArchiveLogs = () =>
  applyDecorators(Permissions(), ArchiveLogsSwaggerDefinition())
