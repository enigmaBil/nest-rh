import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './database/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LeavesModule } from './leaves/leaves.module';
import { TimesheetsModule } from './timesheets/timesheets.module';
import { ReportsModule } from './reports/reports.module';
import { SearchModule } from './search/search.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync(typeOrmConfig),
    AuthModule,
    UsersModule,
    LeavesModule,
    TimesheetsModule,
    ReportsModule,
    SearchModule,
    NotificationsModule,
    EvaluationsModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
