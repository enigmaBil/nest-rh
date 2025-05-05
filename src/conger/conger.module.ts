import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CongerController } from './conger.controller';
import { CongerService } from './conger.service';
import { Conger } from './entities/conger.entity';
import { MailModule } from '../mail/mail.module'; // Ajouter l'importation de MailModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Conger]),
    MailModule, // Assurez-vous que MailModule est inclus ici
  ],
  controllers: [CongerController],
  providers: [CongerService],
})
export class CongerModule {}
