import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    prodCode!: string;

    @IsString()
    @IsNotEmpty()
    prodName!: string;

    @IsOptional()
    @IsString()
    prodType?: string;

    @IsString()
    @IsNotEmpty()
    prodGroup!: string;

    @IsOptional()
    @IsString()
    prodSize?: string;

    @Transform(({ value }) => parseFloat(value))
    @IsNumber({}, { message: 'O preço deve ser um número válido' })
    @IsNotEmpty()
    prodOriginalPrice!: number; 

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsNumber()
    preferenceGroupId?: number;

    @IsOptional()
    @IsString()
    prodDescription?: string;
    
    @IsOptional()
    @IsString()
    prodImageUrl?: string;
}