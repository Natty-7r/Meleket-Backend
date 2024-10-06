import { Module } from '@nestjs/common'
import PrismaModule from 'src/prisma/prisma.module'
import BusinessService from 'src/business/business.service'
import BusinessModule from 'src/business/business.module'
import UserModule from 'src/user/user.module'
import CategoryController from './category.controller'
import CategoryService from './category.service'

@Module({
  imports: [PrismaModule, BusinessModule, UserModule],
  controllers: [CategoryController],
  providers: [CategoryService, BusinessService],
})
export default class CategoryModule {}
