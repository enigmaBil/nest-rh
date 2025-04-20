import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/common/role.enum';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsEnum(UserRole, {message: 'Le rôle doit être un de ces valeurs: ADMIN, RH, EMPLOYE, ou USER'})
    @IsOptional()
    @Transform(({value}) => value.toUpperCase())
    role?: string;
}
