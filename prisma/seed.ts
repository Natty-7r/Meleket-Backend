import { PrismaClient } from '@prisma/client'
import { generatePackageCode } from 'src/common/util/helpers/string.helper'
import CreatePackageDto from 'src/payment/dto/create-package.dto'

const prisma = new PrismaClient()

async function main() {
  let packagesData: CreatePackageDto[] = [
    {
      name: 'monthly',
      description: 'expired monthly',
      price: 100,
      monthCount: 1,
    },
  ]
  packagesData = packagesData.map((packagesData, index) => {
    return {
      ...packagesData,
      code: generatePackageCode(index + 1, packagesData.name),
    }
  })
  const packages = await prisma.package.findMany({})
  if (!packages || packages.length === 0)
    await prisma.package.createMany({
      data: packagesData as any,
    })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
