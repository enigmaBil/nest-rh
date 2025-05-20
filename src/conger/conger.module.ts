/* eslint-disable prettier/prettier */
// src/conger/conger.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongerController } from './conger.controller';
import { CongerService } from './conger.service';
import { Conger } from './entities/conger.entity';
import { MailModule } from '../mail/mail.module';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conger, User]),
    MailModule,
  ],
  controllers: [CongerController],
  providers: [CongerService],
})
export class CongerModule {}
