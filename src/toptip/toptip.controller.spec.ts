import { Test, TestingModule } from '@nestjs/testing';
import { ToptipController } from './toptip.controller';

describe('ToptipController', () => {
  let controller: ToptipController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToptipController],
    }).compile();

    controller = module.get<ToptipController>(ToptipController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
