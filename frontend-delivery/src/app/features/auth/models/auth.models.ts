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
    user?: any;
}
