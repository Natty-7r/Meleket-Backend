import { TimeFrameParams } from '../types/params.type'

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
  const date = new Date(dateString)
  return date
}
