import { Global, Module } from '@nestjs/common'
import AccessControlService from './access-control.service'
import AccessControlController from './access-control.controller'

@Global()
@Module({
  controllers: [AccessControlController],
  providers: [AccessControlService],
  exports: [AccessControlService],
})
export default class AccessControlModule {}
