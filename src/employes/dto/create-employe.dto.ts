import { IsDateString, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmployeDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  poste: string;

  @IsDateString()
  @IsNotEmpty()
  dateEmbauche: string;
}
