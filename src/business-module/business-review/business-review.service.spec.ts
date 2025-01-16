import { Test, TestingModule } from '@nestjs/testing'
import BusinessReviewService from './business-review.service'

describe('BusinessReviewService', () => {
  let service: BusinessReviewService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessReviewService],
    }).compile()

    service = module.get<BusinessReviewService>(BusinessReviewService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
