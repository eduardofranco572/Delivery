import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCompanyDto {
    @IsOptional()
    @IsString()
    empName?: string;

    @IsOptional()
    @IsString()
    empNameFantasy?: string;

    @IsOptional()
    @IsString()
    empCnpj?: string;

    @IsOptional()
    @IsString()
    empCep?: string;

    @IsOptional()
    @IsString()
    empStreet?: string;

    @IsOptional()
    @IsString()
    empNeighborhood?: string;

    @IsOptional()
    @IsString()
    empCity?: string;

    @IsOptional()
    @IsString()
    empState?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    empFreteBase?: number;

    @IsOptional()
    @IsString()
    empLogo?: string;

    @IsOptional()
    @IsString()
    empBanner?: string;
}