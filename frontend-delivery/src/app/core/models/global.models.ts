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
    empFreteBase: number;
}
