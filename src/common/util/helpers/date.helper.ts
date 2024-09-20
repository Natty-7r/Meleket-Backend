import { TimeFrameParams } from '../types/params.type'

export const calculatePackageExpireDate = (monthCount: number): Date => {
  const packageDuration = monthCount * 30

  const expireDate = new Date(
    new Date().setDate(new Date().getDate() + packageDuration),
  )
  return expireDate
}

export const calculatePackageStartDate = (
  previousPackageEndDate?: Date,
): Date => {
  if (!previousPackageEndDate) return new Date()

  return new Date(previousPackageEndDate.getTime())
}

export const calculateTimeFrame = ({
  startDate,
  timeFrame,
  timeUnit,
}: TimeFrameParams): Date[] => {
  const initialDate = startDate || new Date()
  const endDate = new Date(initialDate)

  switch (timeUnit) {
    case 'd':
      endDate.setDate(endDate.getDate() + timeFrame)
      break
    case 'm':
      endDate.setMonth(endDate.getMonth() + timeFrame)
      break
    case 'y':
      endDate.setFullYear(endDate.getFullYear() + timeFrame)
      break
    default:
  }
  return [initialDate, endDate]
}

export const createDateFromString = (dateString: string): Date => {
  return new Date(dateString)
}
