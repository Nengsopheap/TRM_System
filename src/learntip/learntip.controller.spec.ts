import { Test, TestingModule } from '@nestjs/testing';
import { LearntipController } from './learntip.controller';

describe('LearntipController', () => {
  let controller: LearntipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearntipController],
    }).compile();

    controller = module.get<LearntipController>(LearntipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
