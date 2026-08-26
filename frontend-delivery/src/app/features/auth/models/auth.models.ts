export interface User {
    id: number;
    name: string;
    email: string;
    isAdmin?: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData extends LoginCredentials {
    name: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: User;
}