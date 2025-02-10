import { Test, TestingModule } from '@nestjs/testing';
import { SearchServiceController } from './search-service.controller';
import { SearchServiceService } from './search-service.service';

describe('SearchServiceController', () => {
  let controller: SearchServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchServiceController],
      providers: [SearchServiceService],
    }).compile();

    controller = module.get<SearchServiceController>(SearchServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
