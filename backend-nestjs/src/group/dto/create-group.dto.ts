import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateGroupDto {
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @MaxLength(100)
    name!: string;
}