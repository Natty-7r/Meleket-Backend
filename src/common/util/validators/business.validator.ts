import { BadRequestException } from '@nestjs/common'
import { ValidateStory } from '../types/params.type'

export const validateStory = ({ contentType, image, text }: ValidateStory) => {
  if (contentType == 'BOTH') {
    if (!image || !text)
      throw new BadRequestException('Both image and text of story required')
  } else if (contentType == 'IMAGE') {
    if (!image) throw new BadRequestException('Story image required')
  } else if (!text) throw new BadRequestException('Story text required')
}
