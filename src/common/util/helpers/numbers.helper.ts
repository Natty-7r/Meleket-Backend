export const generateOTP = (length: number = 6) => {
  return (Math.random() * 10 ** length).toFixed(0)
}
export const generateEightDigitNumberString = (num: number): string => {
  return num.toString().padStart(8, '0')
}
