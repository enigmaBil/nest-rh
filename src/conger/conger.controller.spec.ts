import { Test, TestingModule } from '@nestjs/testing';
import { CongerController } from './conger.controller';

describe('CongerController', () => {
  let controller: CongerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CongerController],
    }).compile();

    controller = module.get<CongerController>(CongerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
