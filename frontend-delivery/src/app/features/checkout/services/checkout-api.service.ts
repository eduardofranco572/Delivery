import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { Address, CompanyInfo } from '../../../core/models/global.models';
import { PlaceOrderPayload, PlaceOrderResponse } from '../models/checkout.models';

@Injectable({ providedIn: 'root' })
export class CheckoutApiService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) {}

    getUserAddresses(userId: number): Observable<Address[]> {
        return this.http.get<Address[]>(`${this.apiUrl}/address/user/${userId}`);
    }

    getCompanyInfo(companyId: number): Observable<CompanyInfo> {
        return this.http.get<CompanyInfo>(`${this.apiUrl}/company/${companyId}`);
    }

    placeOrder(userId: number, payload: PlaceOrderPayload): Observable<PlaceOrderResponse> {
        return this.http.post<PlaceOrderResponse>(`${this.apiUrl}/order/${userId}/checkout`, payload);
    }
}