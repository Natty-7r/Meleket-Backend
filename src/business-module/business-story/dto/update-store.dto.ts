import { PartialType } from '@nestjs/swagger'
import CreateStoryDto from './create-story.dto'

export default class UpdateStoryDto extends PartialType(CreateStoryDto) {}
