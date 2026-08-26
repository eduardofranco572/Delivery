import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class AddressDto {
    @IsNotEmpty()
    @IsString()
    cep!: string;

    @IsNotEmpty()
    @IsString()
    street!: string;

    @IsNotEmpty()
    @IsString()
    number!: string;

    @IsNotEmpty()
    @IsString()
    neighborhood!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}