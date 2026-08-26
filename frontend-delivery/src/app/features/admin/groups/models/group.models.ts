export interface Group {
    id: number;
    name: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
}