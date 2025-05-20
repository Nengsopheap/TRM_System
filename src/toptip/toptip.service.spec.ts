import { Test, TestingModule } from '@nestjs/testing';
import { ToptipService } from './toptip.service';

describe('ToptipService', () => {
  let service: ToptipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToptipService],
    }).compile();

    service = module.get<ToptipService>(ToptipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
