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
