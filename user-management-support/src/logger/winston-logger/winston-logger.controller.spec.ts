import { Test, TestingModule } from '@nestjs/testing'
import WinstonLoggerController from './winston-logger.controller'

describe('WinstonLoggerController', () => {
  let controller: WinstonLoggerController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WinstonLoggerController],
    }).compile()

    controller = module.get<WinstonLoggerController>(WinstonLoggerController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
