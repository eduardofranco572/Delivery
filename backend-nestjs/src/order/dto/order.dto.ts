import { IsString, IsNumber, IsOptional, IsObject, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../address/dto/address.dto';

export class CheckoutDto {
    @IsNotEmpty()
    @IsString()
    paymentMethod!: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    changeFor?: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    freightValue!: number;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address!: AddressDto;
}