import { BadRequestException } from '@nestjs/common'
import CreateStoryDto from 'src/business/dto/create-story.dto'

export const validateStory = ({ contentType, image, text }: CreateStoryDto) => {
  if (contentType == 'BOTH') {
    if (!image || !text)
      throw new BadRequestException('Both image and text of story required')
  } else if (contentType == 'IMAGE') {
    if (!image) throw new BadRequestException('Story image required')
  } else if (!text) throw new BadRequestException('Story text required')
}
