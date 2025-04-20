

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongerController } from './conger.controller';
import { CongerService } from './conger.service';
import { Conger } from './entities/conger.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conger])],
  controllers: [CongerController],
  providers: [CongerService],
})
export class CongerModule {}
