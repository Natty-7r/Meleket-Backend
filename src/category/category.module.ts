import { Module } from '@nestjs/common'
import PrismaModule from 'src/prisma/prisma.module'
import UserModule from 'src/user/user.module'
import BusinessModule from 'src/business-module/business/business.module'
import CategoryController from './category.controller'
import CategoryService from './category.service'

@Module({
  imports: [PrismaModule, BusinessModule, UserModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export default class CategoryModule {}
