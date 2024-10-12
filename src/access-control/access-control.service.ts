import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Admin, Permission, Role, User } from '@prisma/client'
import { BaseIdParams, BaseNameParams } from 'src/common/types/params.type'
import PrismaService from 'src/prisma/prisma.service'
import {
  USER_PERMISSION_SELECTOR,
  USER_ROLE_NAME,
  NULL_ROLE_NAME,
} from 'src/common/constants/access-control.contants'
import { RoleWithCountInfo } from 'src/common/types/base.type'
import {
  BaseAdminIdParams,
  BaseIdListParams,
  BaseSelectorParams,
  CheckRoleNameParams,
} from '../common/types/params.type'
import CreateRoleDto from './dto/create-role.dto'
import UpdateRoleDto from './dto/update-role.dto'

@Injectable()
export default class AccessControlService {
  constructor(private readonly prismaService: PrismaService) {}

  /** helper private repository methods */
  private async verifyRoleId({ id }: BaseIdParams): Promise<RoleWithCountInfo> {
    const role = await this.prismaService.role.findFirst({
      where: { id },
      /*eslint-disable*/
      include: { _count: { select: { admins: true, users: true } } },
      /*eslint-disable*/
    })
    if (!role) throw new NotFoundException('Role not found')
    return role
  }

  private async verifyAdminId({ id }: BaseIdParams): Promise<Admin> {
    const admin = await this.prismaService.admin.findFirst({ where: { id } })
    if (!admin) throw new NotFoundException('Admin not found')
    return admin
  }

  private async checkroleName({
    forUpdate,
    name,
  }: CheckRoleNameParams): Promise<boolean> {
    const role = await this.prismaService.role.findFirst({ where: { name } })
    if (role) {
      if (!forUpdate) {
        // Case 1: Role exists and the role is not being updated
        throw new ConflictException('Role name already exists')
      }

      if (forUpdate && role.id !== forUpdate.roleId) {
        // Case 2: Role exists and role is being update but the name is reserved by other role in the company
        throw new ConflictException('Role name already exists')
      }
    }
    return true
  }

  async verifyUserId({ id }: BaseIdParams): Promise<Admin | User> {
    const user =
      (await this.prismaService.user.findFirst({ where: { id } })) ||
      (await this.prismaService.admin.findFirst({ where: { id } }))
    if (!user) throw new NotFoundException(' User Not found')

    // if (( typeof user) === Admin &&  user === 'INACTIVE')
    //   throw new CustomErrorException('Inactive user ', HttpStatus.UNAUTHORIZED)
    return user
  }

  async getUserPermissions({ id }): Promise<Permission[]> {
    const user = await this.verifyUserId({ id })
    const role = await this.verifyRoleId({ id: user?.roleId })
    return this.prismaService.permission.findMany({
      where: {
        Roles: {
          some: { id: role.id },
        },
      },
    })
  }

  // async verifyAdminCompanyOwnerShip({
  //   id,
  //   adminId,
  //   moduleName,
  // }: VerifyCompanyOwnershipParams) {
  //   const admin = await this.verifyAdmin({ id: adminId })
  //   let companyId: string = ''
  //   let entity: Enitity
  //   switch (moduleName) {
  //     case 'ADMIN': {
  //       const assingeeAadmin = await this.verifyAdminId({ id })
  //       companyId = assingeeAadmin.Company?.id
  //       entity = assingeeAadmin
  //       break
  //     }
  //     case 'JOB': {
  //       const job = await this.accessControlRepository.findJobById({ id })
  //       if (!job)
  //         throw new CustomErrorException('Job not found', HttpStatus.NOT_FOUND)
  //       companyId = job.Company?.id
  //       entity = job
  //       break
  //     }
  //     case 'COMPANY': {
  //       const company = await this.accessControlRepository.findCompanyById({
  //         id,
  //       })
  //       if (!company)
  //         throw new CustomErrorException(
  //           'Company not found',
  //           HttpStatus.NOT_FOUND,
  //         )
  //       companyId = company?.id
  //       entity = company
  //       break
  //     }
  //     case 'ROLE': {
  //       const role = await this.verifyRoleId({ id })
  //       companyId = role?.Company?.id
  //       entity = role
  //       break
  //     }
  //     default:
  //       throw new CustomErrorException('Unknown entity', HttpStatus.BAD_REQUEST)
  //   }
  //   if (admin.Company.id !== companyId)
  //     throw new CustomErrorException(
  //       `${moduleName.toString()} Deos not belong to your compnay`,
  //
  //     )
  //   return { id, adminId, entity }
  // }

  async verifyPermissionsId({ ids }: BaseIdListParams): Promise<Permission[]> {
    const filteredIds = [...new Set(ids)]
    const permissions = await this.prismaService.permission.findMany({
      where: { id: { in: ids } },
    })

    if (filteredIds.length > permissions.length)
      throw new BadRequestException('Permission list is invalid')
    return permissions
  }

  async getPermissions({ adminId }): Promise<Permission[]> {
    await this.verifyAdminId({ id: adminId })
    return this.prismaService.permission.findMany()
  }

  async getRolePermissions({ id }: BaseIdParams): Promise<Permission[]> {
    return this.prismaService.permission.findMany({
      where: { Roles: { some: { id } } },
    })
  }

  async getAdminPermissions({
    adminId,
  }: BaseAdminIdParams): Promise<Permission[]> {
    const admin = await this.verifyAdminId({ id: adminId })
    return this.getRolePermissions({ id: admin.id })
  }

  async findPermissionByCondition({ selector }: BaseSelectorParams) {
    return this.prismaService.permission.findMany({ where: selector })
  }

  async getRoles(): Promise<Role[]> {
    return this.prismaService.role.findMany()
  }

  async getRoleByName({ name }: BaseNameParams): Promise<Role> {
    return this.prismaService.role.findFirst({
      where: { name },
    })
  }

  async getRoleDetail({ id }: BaseIdParams): Promise<Role> {
    return this.prismaService.role.findFirst({
      where: { id },
      include: {
        permissions: true,
        admins: { select: { id: true, firstName: true, lastName: true } },
        users: { select: { id: true, firstName: true, lastName: true } },
      },
    })
  }

  async createRole(
    createRoleDto: CreateRoleDto & BaseAdminIdParams,
  ): Promise<Role> {
    const { adminId, name, permissions: permissionIds } = createRoleDto
    await this.checkroleName({ name })
    const permissions = await this.verifyPermissionsId({
      ids: permissionIds,
    })
    return this.prismaService.role.create({
      data: {
        name,
        permissions: {
          connect: permissions,
        },
        creatorId: adminId,
        roleType: 'ADMIN',
      },
    })
  }

  async updateRole({
    id,
    adminId,
    name,
    permissions: idList,
  }: UpdateRoleDto & BaseAdminIdParams & BaseIdParams): Promise<Role> {
    await this.verifyRoleId({ id })
    await this.verifyAdminId({ id: adminId })
    await this.checkroleName({
      name,
      forUpdate: { roleId: id },
    })
    const permissions = await this.verifyPermissionsId({ ids: idList })
    return this.prismaService.role.update({
      where: { id },
      data: {
        name,
        permissions: { disconnect: [], connect: permissions },
      },
    })
  }

  async deleteRole({ id }: BaseIdParams): Promise<void> {
    const role = await this.verifyRoleId({ id })

    /* eslint-disable */
    if (role._count.admins > 0 || role._count.users > 0)
      throw new BadRequestException(
        `Role is associate with user please revoke first`,
      )
    this.prismaService.role.delete({ where: { id } })
  }

  async assigneAdminRole({ id, adminId, roleId }) {
    const assignee = await this.verifyAdminId({ id })

    if (assignee.id === adminId)
      throw new ForbiddenException('Assigning self not allowed')

    return this.prismaService.admin.update({
      where: {
        id,
      },
      data: {
        roleId,
      },
      include: { role: { select: { name: true, id: true } } },
    })
  }

  async revokeAdminRole({ id, adminId }) {
    await this.verifyAdminId({ id })

    let nullRole = await this.prismaService.role.findFirst({
      where: { name: NULL_ROLE_NAME },
    })
    if (!nullRole)
      nullRole = await this.createRole({
        name: NULL_ROLE_NAME,
        permissions: [],
        adminId,
        roleType: 'ADMIN',
      })

    return this.assigneAdminRole({
      roleId: nullRole.id,
      id,
      adminId,
    })
  }

  async getApplicantRole() {
    let applicantRole = await this.getRoleByName({
      name: USER_ROLE_NAME,
    })
    if (applicantRole) return applicantRole

    const permissions = await this.findPermissionByCondition({
      selector: USER_PERMISSION_SELECTOR,
    })

    const permissionIds = permissions.map((permission) => permission.id)
    return this.createRole({
      name: USER_ROLE_NAME,
      permissions: permissionIds,
      roleType: 'CLIENT',
      adminId: null,
    })
  }
}
