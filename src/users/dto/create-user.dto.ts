import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { UserRole } from "src/common/role.enum";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    name: string;
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    email: string;
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @ApiProperty()
    
    password: string;
    @IsEnum(UserRole, {message: 'Le rôle doit être un de ces valeurs: ADMIN, RH, EMPLOYE, ou USER'})
    @Transform(({ value }) => value?.toUpperCase() || UserRole.USER)
    @ApiProperty({ enum: UserRole, default: UserRole.USER })
    role?: string;
}
