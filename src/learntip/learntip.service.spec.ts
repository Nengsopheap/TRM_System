import { Test, TestingModule } from '@nestjs/testing';
import { LearntipService } from './learntip.service';

describe('LearntipService', () => {
  let service: LearntipService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearntipService],
    }).compile();

    service = module.get<LearntipService>(LearntipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
