import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { IsInt, IsString, IsArray, IsOptional } from 'class-validator';

@InputType()
export class CartItemInput {
    @Field(() => Int)
    @IsInt()
    productId!: number;

    @Field(() => Int)
    @IsInt()
    quantity!: number;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    observation?: string;

    @Field(() => [Int], { nullable: true })
    @IsArray()
    @IsOptional()
    preferenceIds?: number[];
}

@ObjectType()
export class CartAddResponse {
    @Field(() => String) 
    message!: string;

    @Field(() => String) 
    cartItemId!: string;
}