import { Test, TestingModule } from '@nestjs/testing';
import { CongerService } from './conger.service';

describe('CongerService', () => {
  let service: CongerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CongerService],
    }).compile();

    service = module.get<CongerService>(CongerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
