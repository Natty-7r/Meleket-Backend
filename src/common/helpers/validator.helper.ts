import { BadRequestException } from '@nestjs/common'
import { MIN_USER_AGE } from '../constants/base.constants'
import { ValidateStory } from '../types/params.type'

export const validateAge = (birthDate: Date): number => {
  try {
    const now = new Date()
    const birthDateParsed = new Date(birthDate)
    const ageInYear =
      now.getFullYear() - new Date(birthDateParsed).getFullYear()
    const monthCount = now.getMonth() - birthDateParsed.getMonth()
    if (ageInYear < MIN_USER_AGE)
      if (monthCount < 7)
        throw new BadRequestException(
          `Only ${MIN_USER_AGE} or above user allowed to use `,
        )

    return monthCount >= 7 ? ageInYear + 1 : ageInYear
  } catch (error: any) {
    throw new BadRequestException(error.message)
  }
}

export const validateStory = ({ contentType, image, text }: ValidateStory) => {
  if (contentType === 'BOTH') {
    if (!image || !text)
      throw new BadRequestException('Both image and text of story required')
  } else if (contentType === 'IMAGE') {
    if (!image) throw new BadRequestException('Story image required')
  } else if (!text) throw new BadRequestException('Story text required')
}
