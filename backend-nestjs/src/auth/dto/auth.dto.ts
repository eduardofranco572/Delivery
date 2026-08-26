import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignupDto {
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @IsString()
    name!: string;

    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    @IsEmail({}, { message: 'Forneça um e-mail válido' })
    email!: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
    password!: string;
}

export class LoginDto {
    @IsNotEmpty({ message: 'O e-mail é obrigatório' })
    @IsEmail({}, { message: 'Forneça um e-mail válido' })
    email!: string;

    @IsNotEmpty({ message: 'A senha é obrigatória' })
    @IsString()
    password!: string;
}