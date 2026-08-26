import { IsString, IsNumber, IsOptional, IsNotEmpty, IsArray } from 'class-validator';

export class CreatePreferenceDto {
    @IsString()
    @IsNotEmpty()
    prefCode!: string;

    @IsString()
    @IsNotEmpty()
    prefName!: string;

    @IsString()
    @IsOptional()
    prefImg?: string;

    @IsString()
    @IsOptional()
    prefDescription?: string;

    @IsNumber()
    @IsOptional()
    prefQtd?: number;

    @IsNumber()
    @IsOptional()
    prefPrice?: number;

    @IsString()
    @IsOptional()
    prefType?: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    groupIds?: number[];
}