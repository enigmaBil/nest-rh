import { IsNotEmpty, IsNumber, IsDateString, IsString } from 'class-validator';

export class CreateEvaluationDto {
  @IsNumber()
  @IsNotEmpty()
  score: number;

  @IsString()
  @IsNotEmpty()
  commentaire: string;

  @IsDateString()
  @IsNotEmpty()
  dateEvaluation: string;

  @IsNumber()
  @IsNotEmpty()
  employeId: number;
}
