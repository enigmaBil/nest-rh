import { Module } from '@nestjs/common';
import { TimesheetsService } from './timesheets.service';
import { TimesheetsController } from './timesheets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { User } from 'src/users/entities/user.entity';
import { Timesheet } from './entities/timesheet.entity';

@Module({
  controllers: [TimesheetsController],
  providers: [TimesheetsService],
  exports: [TimesheetsService],
  imports: [
    TypeOrmModule.forFeature([Timesheet, User]),
    MailModule,
  ],
})
export class TimesheetsModule {}
