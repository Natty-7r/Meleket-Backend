export const changeSpaceByHypen = (text: string): string => {
  return text.replace(/ /g, '-')
}

export const capitalize = (text: string): string =>
  text[0].toLocaleUpperCase().concat(text.slice(1))
