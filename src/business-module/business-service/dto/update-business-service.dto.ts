import { OmitType, PartialType } from '@nestjs/swagger'
import CreateBusinessServiceDto from './create-business-service.dto'

export default class UpdateBusinessServiceDto extends OmitType(
  PartialType(CreateBusinessServiceDto),
  ['businessId'],
) {}
