import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Admin, Business, Permission, Role, User } from '@prisma/client'
import {
  BaseIdParams,
  BaseNameParams,
  OptionalBaseIdParams,
  VerifyOwnershipParams,
} from 'src/common/types/params.type'
import PrismaService from 'src/prisma/prisma.service'
import {
  USER_PERMISSION_SELECTOR,
  USER_ROLE_NAME,
  NULL_ROLE_NAME,
  CLIENT_ROLE_NAME,
  CLIENT_PERMISSION_SELECTOR,
} from 'src/common/constants/access-control.contants'
import {
  BusinessSubEntity,
  RoleWithCountInfo,
} from 'src/common/types/base.type'
import { VerifyOwnershipResponse } from 'src/common/types/responses.type'
import {
  BaseAdminIdParams,
  BaseIdListParams,
  BaseSelectorParams,
  CheckRoleNameParams,
  BaseOptionalRoleIdParams,
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
  private async verifyBussinessId({ id }: BaseIdParams): Promise<Business> {
    const business = await this.prismaService.business.findFirst({
      where: { id },
    })
    if (!business) throw new NotFoundException('Bussiness not found')
    return business
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

  async verifyBussinessOwnerShip({
    id,
    model,
    userId,
  }: VerifyOwnershipParams): Promise<VerifyOwnershipResponse> {
    let entity: BusinessSubEntity = null
    let isBussiness: boolean = false
    let entityName: string = ''
    const user = (await this.verifyUserId({ id: userId })) as User
    switch (model) {
      case 'BUSINESS':
        entity = await this.prismaService.business.findFirst({ where: { id } })
        isBussiness = true
        entityName = 'Bussiness'
        break

      case 'BUSINESS_SERVICE':
        entity = await this.prismaService.bussinessService.findFirst({
          where: { id },
        })
        entityName = 'Bussiness service'
        break

      case 'BUSINESS_ADDRESS':
        entity = await this.prismaService.businessAddress.findFirst({
          where: { id },
        })
        entityName = 'Bussiness address'
        break

      case 'BUSINESS_CONTACT':
        entity = await this.prismaService.businessContact.findFirst({
          where: { id },
        })
        entityName = 'Bussiness contact'
        break

      case 'BUSINESS_PACKAGE':
        entity = await this.prismaService.businessPackage.findFirst({
          where: { id },
        })
        entityName = 'Bussiness package'
        break

      case 'STORY':
        entity = await this.prismaService.story.findFirst({
          where: { id },
        })
        entityName = 'Story'
        break

      case 'BILL':
        entity = await this.prismaService.bill.findFirst({
          where: { id },
        })
        entityName = 'Bill'
        break

      default:
        throw new BadGatewayException('Invalid bussiness sub type')
    }
    if (!entity) throw new NotFoundException(`${entityName} not found`)

    const bussiness = await this.verifyBussinessId({
      id: isBussiness ? entity.id : (entity as any)?.businessId,
    })

    if (bussiness.ownerId !== user.id)
      throw new ForbiddenException('Bussiness deos not belong to you')
    return {
      entity,
      isBussiness,
      user,
      businessId: isBussiness ? entity.id : (entity as any).businessId,
    }
  }

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
    return this.prismaService.role.findMany({
      where: { name: { not: NULL_ROLE_NAME } },
    })
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
    createRoleDto: CreateRoleDto & OptionalBaseIdParams,
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

  async getUserRole(): Promise<Role> {
    let clientRole = await this.getRoleByName({
      name: USER_ROLE_NAME,
    })
    if (clientRole) return clientRole

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

  async getClientRole(): Promise<Role> {
    // business owner
    let clientRole = await this.getRoleByName({
      name: CLIENT_ROLE_NAME,
    })
    if (clientRole) return clientRole

    const permissions = await this.findPermissionByCondition({
      selector: CLIENT_PERMISSION_SELECTOR,
    })

    const permissionIds = permissions.map((permission) => permission.id)
    return this.createRole({
      name: USER_ROLE_NAME,
      permissions: permissionIds,
      roleType: 'CLIENT',
      adminId: null,
    })
  }

  async assignClientRole({ id }: BaseIdParams) {
    await this.verifyUserId({ id })
    const clientRole = await this.getClientRole()
    return this.prismaService.user.update({
      where: { id },
      data: { roleId: clientRole.id },
    })
  }
  async getNullRole() {
    const role = await this.getRoleByName({ name: NULL_ROLE_NAME })
    if (!role)
      return await this.createRole({
        name: NULL_ROLE_NAME,
        permissions: [],
        roleType: 'ADMIN',
      })
    return role
  }

  async getAdminRole({ roleId }: BaseOptionalRoleIdParams) {
    if (roleId) return this.verifyRoleId({ id: roleId })
    return this.getNullRole()
  }
}
