export interface Preference {
    id: number;
    prefName: string;
    prefPrice?: number;
}

export interface PreferenceGroup {
    id: number;
    name: string;
    preferences: Preference[];
}

export interface Product {
    id: number;
    prodName: string;
    prodDescription?: string;
    prodImageUrl?: string;
    prodOriginalPrice: number;
    prodPromotionalPrice?: number;
    preferenceGroups?: PreferenceGroup[];
}

export interface Category {
    id: number;
    catName: string;
    companyId: number;
    products: Product[];
}

