import { Module } from '@nestjs/common'
import UserService from './user.service'
import UserController from './user.controller'
import BusinessModule from 'src/business/business.module'

@Module({
  imports: [BusinessModule],
  providers: [UserService],
  controllers: [UserController],
})
export default class UserModule {}
