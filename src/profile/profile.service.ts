import { Injectable } from '@nestjs/common'
import AuthService from 'src/auth/auth.service'
import PrismaService from 'src/prisma/prisma.service'

@Injectable()
export default class ProfileService {
  constructor(private readonly authService: AuthService) {}
}
