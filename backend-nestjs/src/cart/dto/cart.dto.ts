import { IsInt, IsNotEmpty, IsOptional, IsString, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddCartItemDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    productId!: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsInt()
    @Min(1, { message: 'A quantidade mínima é 1' })
    quantity!: number;

    @IsOptional()
    @IsString()
    observation?: string;

    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    @Type(() => Number)
    preferenceIds?: number[];
}

export interface RedisCartItem {
    cartItemId: string;
    productId: number;
    quantity: number;
    observation: string;
    preferenceIds: number[];
}

export interface RedisCartState {
    items: RedisCartItem[];
}