import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from 'src/common/role.enum';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    @ApiProperty()
    name?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    @ApiProperty()
    password?: string;

    @IsEnum(UserRole, {message: 'Le rôle doit être un de ces valeurs: ADMIN, RH, EMPLOYE, ou USER'})
    @IsOptional()
    @Transform(({value}) => value.toUpperCase())
    @ApiProperty()
    role?: string;
}
