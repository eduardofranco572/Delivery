import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Forneça um e-mail válido' })
    email?: string;
}