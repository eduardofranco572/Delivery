import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginCredentials, SignupData, AuthResponse, User } from '../../features/auth/models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient) {}

    signup(userData: SignupData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, userData);
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap((response) => {
                if (response.user) {
                    this.setUser(response.user);
                }
            })
        );
    }

    logout() {
        this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe();
        this.currentUser.set(null);
        localStorage.removeItem('authUser');
    }

    private setUser(user: User) {
        this.currentUser.set(user);
        localStorage.setItem('authUser', JSON.stringify(user));
    }

    private getUserFromStorage(): User | null {
        const userStr = localStorage.getItem('authUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    isLoggedIn(): boolean {
        return this.currentUser() !== null;
    }

    getUserId(): number | null {
        return this.currentUser()?.id || null;
    }

    isAdmin(): boolean {
        return !!this.currentUser()?.isAdmin;
    }
}