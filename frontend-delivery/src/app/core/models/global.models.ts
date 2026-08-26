export interface Address {
    id: number;
    userId: number;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state?: string;
    type: string;
    isDefault: boolean;
}

export interface CompanyInfo {
    id: number;
    empName: string;
    empNameFantasy?: string;
    empCnpj?: string;
    empCep?: string;
    empLogo?: string;
    empBanner?: string;
    empFreteBase: number;
    empStreet?: string;
    empNeighborhood?: string;
    empCity?: string;
    empState?: string;
}