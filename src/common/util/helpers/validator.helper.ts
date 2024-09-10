import { BadRequestException } from '@nestjs/common'
import { MIN_USER_AGE } from '../constants'

export const validateAge = (birthDate: Date): number => {
  try {
    console.log(new Date(1990))
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
