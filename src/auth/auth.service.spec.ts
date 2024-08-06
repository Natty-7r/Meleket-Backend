import { Test, TestingModule } from '@nestjs/testing'
import PrismaService from '../prisma/prisma.service'
import AuthService from './auth.service'

describe('AuthService', () => {
  let service: AuthService
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService],
    }).compile()

    service = module.get<AuthService>(AuthService)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
