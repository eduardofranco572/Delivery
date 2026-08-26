import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../auth/models/auth.models';
import { Address } from '../../core/models/global.models';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUser(userId: number): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/user/${userId}`);
    }

    updateUser(userId: number, data: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/user/${userId}`, data);
    }

    getAddresses(userId: number): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/address/user/${userId}`);
    }

    createAddress(userId: number, data: Omit<Address, 'id' | 'userId'>): Observable<Address> {
        return this.http.post<Address>(`${this.apiUrl}/address/user/${userId}`, data);
    }

    updateAddress(addressId: number, data: Partial<Address>): Observable<Address> {
        return this.http.put<Address>(`${this.apiUrl}/address/${addressId}`, data);
    }
}