import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common'
import User from 'src/common/decorators/user.decorator'
import { RequestUser } from 'src/common/types/base.type'
import AdminService from './admin.service'
import {
  DeleteAdmin,
  GetAdminDetail,
  GetAdmins,
  UpdateAdmin,
  UpdateAdminStatus,
} from './decorators/admin-api.decorator'
import UpdateAdminStatusDto from './dto/update-admin-status.dto'
import UpdateAdminDto from './dto/update-admin-account.dto'
import { ApiTags } from '@nestjs/swagger'
@ApiTags('Admin')
@Controller('admins')
export default class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @GetAdmins()
  @Get('')
  getAdmins() {
    return this.adminService.getAdmins()
  }

  @UpdateAdmin()
  @Put('/:id')
  updateAdmin(@Body() updateAdminDto: UpdateAdminDto, @Param('id') id: string) {
    return this.adminService.updateAdmin({
      id,
      ...updateAdminDto,
    })
  }

  @UpdateAdminStatus()
  @Put('/:id/status')
  updateAdminStatus(
    @Body() updateAdminStatusDto: UpdateAdminStatusDto,
    @Param('id') id: string,
    @User() admin: RequestUser,
  ) {
    return this.adminService.updateAdminStatus({
      id,
      adminId: admin.id,
      ...updateAdminStatusDto,
    })
  }

  @DeleteAdmin()
  @Delete('/:id')
  deleteAdmin(@Param('id') id: string, @User() admin: RequestUser) {
    return this.adminService.deleteAdmin({
      id,
      adminId: admin.id,
    })
  }

  @GetAdminDetail()
  @Get('/:id')
  getAdminDetail(@Param('id') id: string) {
    return this.adminService.getAdminDetail({
      id,
    })
  }
}
