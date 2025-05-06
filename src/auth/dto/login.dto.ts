import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: 'L\'email doit être valide.' })
  @IsNotEmpty({ message: 'L\'email de passe est requis.' })
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis.' })
  @ApiProperty()
  password: string;
}