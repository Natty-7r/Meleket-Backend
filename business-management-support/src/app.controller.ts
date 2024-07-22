import { Controller, Get, UseGuards } from '@nestjs/common'
import AppService from './app.service'
import JwtAuthGuard from './auth/guards/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller()
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
