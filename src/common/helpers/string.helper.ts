import { v4 as uuidv4 } from 'uuid'
import { PACKAGE_CODE_PREFIX } from '../constants/base.constants'
import { generateEightDigitNumberString } from './numbers.helper'
import { RandomStringOptions } from '../types/params.type'

export const changeSpaceByHypen = (text: string): string => {
  return text.replace(/ /g, '-')
}

export const capitalize = (text: string): string =>
  text
    .split(' ')
    .map((word) => word.toLocaleUpperCase())
    .reduce((textCatitalized, wordCapitalized) =>
      textCatitalized.concat(` ${wordCapitalized}`),
    )

export const generateRandomString = (options?: RandomStringOptions) => {
  let length
  let lowercase = false
  if (options) {
    length = options.length
    lowercase = options.lowercase
  }
  let string = uuidv4()
  if (length)
    if (length < string.length) {
      string = string.slice(0, length - 1)
    } else {
      const repeateRound = Math.ceil(length / string.length)
      string = string.repeat(repeateRound).slice(0, length - 1)
    }
  if (lowercase) return string
  return string.toLocaleUpperCase()
}

export const generatePackageCode = (
  packageCount: number,
  middleText?: string,
) => {
  return PACKAGE_CODE_PREFIX.concat(
    middleText ? `${middleText.toLocaleUpperCase()}_` : '',
  ).concat(generateEightDigitNumberString(packageCount + 1))
}

export const tolowercaseCustom = (text: string): string =>
  text.toLocaleLowerCase().trim() || text
