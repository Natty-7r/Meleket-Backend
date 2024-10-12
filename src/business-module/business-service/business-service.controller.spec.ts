import { Test, TestingModule } from '@nestjs/testing'
import BusinessServiceController from './business-service.controller'

describe('BusinessServiceController', () => {
  let controller: BusinessServiceController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessServiceController],
    }).compile()

    controller = module.get<BusinessServiceController>(
      BusinessServiceController,
    )
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
