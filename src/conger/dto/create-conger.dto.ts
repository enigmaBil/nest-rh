// src/conger/dto/create-conger.dto.ts
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { StatutConge } from '../entities/status.enum';

export class CreateCongerDto {
  @IsString()
  nom: string;

  @IsString()
  dateDebut: string;

  @IsString()
  dateFin: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsEnum(StatutConge)
  statut?: StatutConge;
}
