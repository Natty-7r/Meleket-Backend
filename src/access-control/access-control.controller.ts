import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  Delete,
} from '@nestjs/common'
import User from 'src/common/decorators/user.decorator'
import { ApiTags } from '@nestjs/swagger'
import { RequestUser } from 'src/common/types/base.type'
import CreateRoleDto from './dto/create-role.dto'
import AssignRoleDto from './dto/assign-role.dto'
import {
  AssignAdminRole,
  CreateRole,
  GetPermissions,
  GetRoleDetail,
  GetRolePermissions,
  GetRoles,
  RevokeRole,
  UpdateRole,
} from './decorators/access-contorl-api.decorator'
import UpdateRoleDto from './dto/update-role.dto'
import AccessControlService from './access-control.service'

@ApiTags('Access Contorl')
@Controller('access-control')
export default class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @GetPermissions()
  @Get('permissions')
  async getPermissions(@User() user: RequestUser) {
    return this.accessControlService.getPermissions({ adminId: user?.id })
  }

  @GetRoles()
  @Get('roles')
  async getRoles() {
    return this.accessControlService.getRoles()
  }

  @GetRoleDetail()
  @Get('roles/:id')
  async getRoleDetail(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.getRoleDetail({ id })
  }

  @GetRolePermissions()
  @Get('roles/:id/permissions')
  async getRolePermissions(@Param('id', ParseUUIDPipe) id: string) {
    return this.accessControlService.getRolePermissions({
      id,
    })
  }

  @CreateRole()
  @Post('roles')
  async createRole(
    @Body() createRoleDto: CreateRoleDto,
    @User() user: RequestUser,
  ) {
    return this.accessControlService.createRole({
      ...createRoleDto,
      adminId: user?.id,
    })
  }

  @UpdateRole()
  @Put('roles/:id')
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @User() user: RequestUser,
  ) {
    return this.accessControlService.updateRole({
      ...updateRoleDto,
      id,
      adminId: user?.id,
    })
  }

  @AssignAdminRole()
  @Put('admins/:id/role')
  async assignAdminRole(
    @Body() assingRoleDto: AssignRoleDto,
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: RequestUser,
  ) {
    return this.accessControlService.assigneAdminRole({
      ...assingRoleDto,
      id,
      adminId: user?.id,
    })
  }

  @RevokeRole()
  @Delete('/admins/:id/role')
  async revokeAdminRole(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: RequestUser,
  ) {
    return this.accessControlService.revokeAdminRole({
      id,
      adminId: user?.id,
    })
  }
}
