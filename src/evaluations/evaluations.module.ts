import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { Evaluation } from './entities/evaluation.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, User]) // <- Import des entités nécessaires
  ],
  controllers: [
    EvaluationsController // <- Contrôleur contenant toutes les routes HTTP
  ],
  providers: [
    EvaluationsService // <- Service métier (logique d’évaluation)
  ],
  exports: [
    EvaluationsService // <- Optionnel : utile si un autre module en a besoin
  ]
})
export class EvaluationsModule {}
