import { Test, TestingModule } from '@nestjs/testing'
import BusinessStoryService from './business-story.service'

describe('BusinessStoryService', () => {
  let service: BusinessStoryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessStoryService],
    }).compile()

    service = module.get<BusinessStoryService>(BusinessStoryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
