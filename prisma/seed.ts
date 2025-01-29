import {
  ModuleName,
  Permission,
  PermissionType,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

interface PermissionSeedDto {
  moduleName: ModuleName
  permissionName: PermissionType
  permissionWeight: number
}

async function seedPermissions() {
  const permissionTypes: Set<PermissionType> = new Set([
    'CREATE',
    'UPDATE',
    'DELETE',
    'READ',
    'CREATE',
  ])

  const moduleList: Set<ModuleName> = new Set([
    'ROLE',
    'PERMISSION',
    'ADMIN',
    'USER',
    'PROFILE',
    'BUSINESS',
    'BUSINESS_SERVICE',
    'BUSINESS_ADDRESS',
    'BUSINESS_CONTACT',
    'CATEGORY',
    'BILL',
    'PACKAGE',
    'BUSINESS_PACKAGE',
    'STORY',
    'STORY_VIEW',
    'REVIEW',
    'RATING',
    'LOG',
  ])

  const permissions: PermissionSeedDto[] = []

  moduleList.forEach((module) => {
    permissionTypes.forEach((permissionType) => {
      let permissionWeight: number = 1
      switch (permissionType) {
        case 'CREATE':
          permissionWeight = 3
          break
        case 'DELETE':
          permissionWeight = 4
          break
        case 'READ':
          permissionWeight = 1
          break
        case 'UPDATE':
          permissionWeight = 2
          break
        default:
          permissionWeight = 1
      }

      permissions.push({
        moduleName: module,
        permissionName: permissionType,
        permissionWeight,
      })
    })
  })
  await prisma.permission.deleteMany({})
  await prisma.permission.createMany({
    data: permissions,
  })
}

async function seedAdmin() {
  await prisma.role.deleteMany()
  await prisma.admin.deleteMany()

  const superAdminData = {
    firstName: process.env.SUPER_ADMIN_FIRST_NAME,
    lastName: process.env.SUPER_ADMIN_LAST_NAME,
    email: process.env.SUPER_ADMIN_EMAIL,
    password: process.env.SUPER_ADMIN_PASSWORD,
  }
  const hashedPassword = await bcrypt.hash(superAdminData.password, 10)

  const SUPER_ADMIN_PERMISSION_SELECTOR: Prisma.PermissionWhereInput = {
    OR: [
      {
        AND: [{ moduleName: 'ROLE' }],
      },
      {
        AND: [{ moduleName: 'PERMISSION' }, { permissionName: 'READ' }],
      },
      {
        AND: [{ moduleName: 'BUSINESS' }, { permissionName: 'UPDATE' }],
      },
      {
        AND: [{ moduleName: 'USER' }, { permissionName: 'UPDATE' }],
      },
      {
        AND: [{ moduleName: 'PACKAGE' }],
      },
      {
        AND: [{ moduleName: 'CATEGORY' }],
      },
    ],
  }

  const permissionList: Permission[] = await prisma.permission.findMany({
    where: SUPER_ADMIN_PERMISSION_SELECTOR,
  })

  const role = await prisma.role.create({
    data: {
      name: 'SUPER_ADMIN',
      roleType: 'ADMIN',
      permissions: { connect: permissionList },
    },
  })

  await prisma.admin.create({
    data: {
      ...superAdminData,
      roleId: role.id,
      password: hashedPassword,
      inActiveReason: '',
      status: 'ACTIVE',
    },
  })
}

async function seedPackages() {
  let packagesData = [
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
      code: `P_${index + 1}_${packagesData.name.toLocaleUpperCase()}`,
    }
  })
  const packages = await prisma.package.findMany({})
  if (!packages || packages.length === 0)
    await prisma.package.createMany({
      data: packagesData as any,
    })
}
async function main() {
  await seedPermissions()
  await seedAdmin()
  await seedPackages()
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
