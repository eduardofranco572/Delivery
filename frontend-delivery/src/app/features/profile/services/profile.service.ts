import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProfileService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getUser(userId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/user/${userId}`);
    }

    updateUser(userId: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/user/${userId}`, data);
    }

    getAddresses(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/address/user/${userId}`);
    }

    createAddress(userId: number, data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/address/user/${userId}`, data);
    }

    updateAddress(addressId: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/address/${addressId}`, data);
    }
}