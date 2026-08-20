import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginCredentials, SignupData, AuthResponse } from '../../features/auth/models/auth.models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api/auth';

    constructor(private http: HttpClient) {}

    signup(userData: SignupData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData);
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
    }

    setToken(token: string) {
        document.cookie = `token=${token}; path=/; max-age=86400`;
    }

    getToken(): string | null {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
        return match ? match[2] : null;
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getUserId(): number | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded.id;

        } catch (e) {
            console.error('Erro ao decodificar o token', e);
            return null;
        }
    }
}