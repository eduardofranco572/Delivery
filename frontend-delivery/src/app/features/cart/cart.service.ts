import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TenantService } from '../../core/services/tenant.service';
import { CartPayload, CartResponse } from './models/cart.models';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = `${environment.apiUrl}/cart`;

    private cartCountSubject = new BehaviorSubject<number>(0);
    public cartCount$ = this.cartCountSubject.asObservable();

    constructor(
        private http: HttpClient,
        private tenantService: TenantService
    ) {}

    updateCartCount(userId: number) {
        this.http.get<{count: number}>(`${this.apiUrl}/${userId}/count`).subscribe({
            next: (res) => this.cartCountSubject.next(res.count),
            error: (err) => console.error('Erro ao buscar contagem', err)
        });
    }

    getCart(userId: number): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${this.apiUrl}/${userId}`);
    }

    addItem(userId: number, itemData: CartPayload): Observable<{ message: string, cartItemId: string }> {
        return this.http.post<{ message: string, cartItemId: string }>(`${this.apiUrl}/${userId}/add`, itemData);
    }

    removeItem(userId: number, cartItemId: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${userId}/item/${cartItemId}`);
    }

    updateItemQuantity(userId: number, cartItemId: string, quantity: number): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/${userId}/item/${cartItemId}/quantity`, { quantity });
    }
}