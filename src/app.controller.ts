import { Controller, Get, Res } from '@nestjs/common'
import AppService from './app.service'

@Controller('')
export default class AppController {
  constructor(private readonly appService: AppService) {}
  @Get('/')
  async getReadme() {
    return this.appService.agetReadme()
  }
}
