import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, CancelOrderResponse } from './models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
    private apiUrl = `${environment.apiUrl}/order`;

    constructor(private http: HttpClient) {}

    getUserOrders(userId: number): Observable<OrderResponse[]> {
        return this.http.get<OrderResponse[]>(`${this.apiUrl}/user/${userId}`);
    }

    cancelOrder(orderId: number): Observable<CancelOrderResponse> {
        return this.http.put<CancelOrderResponse>(`${this.apiUrl}/${orderId}/cancel`, {});
    }
}