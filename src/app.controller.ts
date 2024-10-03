import { Controller, Get } from '@nestjs/common'
import AppService from './app.service'
import Public from './common/decorators/public.decorator'

@Controller('')
export default class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get('/')
  async getReadme() {
    return this.appService.agetReadme()
  }
}
