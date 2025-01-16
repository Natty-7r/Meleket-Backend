import { Test, TestingModule } from '@nestjs/testing'
import BusinessReviewController from './business-review.controller'

describe('BusinessReviewController', () => {
  let controller: BusinessReviewController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessReviewController],
    }).compile()

    controller = module.get<BusinessReviewController>(BusinessReviewController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
