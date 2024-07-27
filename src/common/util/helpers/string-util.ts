export const changeSpaceByHypen = (text: string): string => {
  return text.replace(/ /g, '-')
}

export const Capitalize = (text: string): string =>
  text[0].toLocaleUpperCase().concat(text.slice(1))
