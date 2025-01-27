import { PartialType } from '@nestjs/swagger'
import CreateBusinessDto from './create-business.dto'

export default class UpdateBusinessDto extends PartialType(CreateBusinessDto) {}
