export interface Preference {
    id: number;
    prefCode?: string;
    prefName: string;
    prefType?: string;
    prefDescription?: string;
    prefQtd?: number | null;
    prefPrice?: number;
    groupIds?: number[];
    groups?: { id: number; name: string }[];
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
    products: Product[];
}

