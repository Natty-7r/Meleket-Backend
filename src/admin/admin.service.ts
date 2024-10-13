import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import LoggerService from 'src/logger/logger.service'
import { Admin } from '@prisma/client'
import { ApiResponse, BareApiResponse } from 'src/common/types/responses.type'
import { removePassword } from 'src/common/helpers/parser.helper'
import UpdateAdminStatusDto from './dto/update-admin-status.dto'
import CreateAdminDto from './dto/create-admin-account.dto'
import UpdateAdminDto from './dto/update-admin-account.dto'
import {
  BaseAdminIdParams,
  BaseIdParams,
  BaseRoleIdParams,
} from '../common/types/params.type'

@Injectable()
export default class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly loggerSerive: LoggerService,
  ) {}

  private async verfiyAdminId({ id }: BaseIdParams): Promise<Admin> {
    const admin = await this.prismaService.admin.findUnique({
      where: { id },
    })
    if (!admin) throw new BadRequestException('Invalid admin id ')
    return admin
  }

  async createAdminAccount({
    firstName,
    lastName,
    email,
    password,
    roleId,
  }: CreateAdminDto & BaseRoleIdParams) {
    const admin = await this.prismaService.admin.findFirst({ where: { email } })
    if (admin) throw new ConflictException('Email is already in use!')
    return this.prismaService.admin.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        roleId,
        status: 'CREATED',
        inActiveReason: 'new account',
      },
    })
  }

  async updateAdmin({
    id,
    firstName,
    lastName,
  }: UpdateAdminDto & BaseIdParams): Promise<ApiResponse> {
    let admin = await this.verfiyAdminId({ id })

    admin = await this.prismaService.admin.update({
      where: { id },
      data: {
        firstName: firstName || admin.firstName,
        lastName: lastName || admin.lastName,
      },
    })
    return {
      data: removePassword(admin),
      status: 'success',
      message: 'Admin  updated  successfully',
    }
  }

  async updateAdminStatus({
    id,
    status,
    reason,
    adminId,
  }: UpdateAdminStatusDto & BaseAdminIdParams & BaseIdParams) {
    let admin = await this.verfiyAdminId({ id })
    admin = await this.prismaService.admin.update({
      where: { id },
      data: { status, inActiveReason: reason || '' },
    })
    this.loggerSerive.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: `admin  status  with ID: ${admin.id} updated to ${status} by admin with ID ${adminId}`,
      context: 'admin deleted',
    })

    return {
      data: removePassword(admin),
      status: 'success',
      message: 'Admin status updated  successfully',
    }
  }

  async deleteAdmin({
    id,
    adminId,
  }: BaseIdParams & BaseAdminIdParams): Promise<BareApiResponse> {
    let admin = await this.verfiyAdminId({ id })

    if (id === adminId)
      throw new ForbiddenException('Deleting self account not allowed')

    admin = await this.prismaService.admin.delete({
      where: { id },
    })
    this.loggerSerive.createLog({
      logType: 'ADMIN_ACTIVITY',
      message: `admin account with ID:${admin.id} deleted by admin with ID ${adminId}`,
      context: 'admin deleted',
    })
    return {
      status: 'success',
      message: 'Admin  deleted  successfully',
    }
  }

  async getAdmins(): Promise<ApiResponse> {
    const admins = await this.prismaService.admin.findMany()
    return {
      data: admins,
      status: 'success',
      message: 'Admins fetched  successfully',
    }
  }

  async getAdminDetail({ id }: BaseIdParams): Promise<ApiResponse> {
    const admin = await this.prismaService.admin.findMany({
      where: { id },
      include: {
        role: true,
      },
    })
    const logs = await this.prismaService.log.findMany({
      where: { adminId: id },
    })
    return {
      data: { ...admin, logs },
      status: 'success',
      message: 'Admins detail  successfully',
    }
  }
}
