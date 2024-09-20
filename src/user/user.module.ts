import { Module } from '@nestjs/common'
import BusinessModule from 'src/business/business.module'
import UserService from './user.service'
import UserController from './user.controller'

@Module({
  imports: [BusinessModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export default class UserModule {}
