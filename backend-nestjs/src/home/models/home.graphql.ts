import { Field, Int, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class Preference {
    @Field(() => Int) 
    id!: number;

    @Field(() => String) 
    prefName!: string;

    @Field(() => Float, { nullable: true }) 
    prefPrice?: number | null;
}

@ObjectType()
export class PreferenceGroup {
    @Field(() => Int) 
    id!: number;

    @Field(() => String) 
    name!: string;

    @Field(() => [Preference]) 
    preferences!: Preference[];
}

@ObjectType()
export class Product {
    @Field(() => Int) 
    id!: number;

    @Field(() => String) 
    prodName!: string;

    @Field(() => String, { nullable: true }) 
    prodDescription?: string | null;

    @Field(() => String, { nullable: true }) 
    prodImageUrl?: string | null;

    @Field(() => Float) 
    prodOriginalPrice!: number;

    @Field(() => Float, { nullable: true }) 
    prodPromotionalPrice?: number | null;

    @Field(() => [PreferenceGroup], { nullable: true }) 
    preferenceGroups?: PreferenceGroup[] | null;
}

@ObjectType()
export class Category {
    @Field(() => Int) 
    id!: number;

    @Field(() => String) 
    catName!: string;

    @Field(() => [Product]) 
    products!: Product[];
}