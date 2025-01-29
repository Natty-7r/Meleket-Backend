import { PartialType } from '@nestjs/swagger'
import CreateBusinessAddressDto from './create-business-address.dto'

export default class UpdateBusinessAddressDto extends PartialType(
  CreateBusinessAddressDto,
) {}
