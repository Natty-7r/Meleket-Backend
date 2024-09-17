import { PackageType } from '@prisma/client'

export const calculatePackageExpireDate = (packageType: PackageType): Date => {
  let packageDuration = 0
  switch (packageType) {
    case 'MONTHLY':
      packageDuration = 30
      break
    case 'THREE_MONTHLY':
      packageDuration = 90
      break
    case 'SIX_MONTHLY':
      packageDuration = 180
      break
    case 'YEARLY':
      packageDuration = 366
      break
    default:
      packageDuration = 1
  }

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
