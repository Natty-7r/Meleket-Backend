import { Test, TestingModule } from '@nestjs/testing'
import BusinessStoryController from './business-story.controller'

describe('BusinessStoryController', () => {
  let controller: BusinessStoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessStoryController],
    }).compile()

    controller = module.get<BusinessStoryController>(BusinessStoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
