import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardMetrics {
    totalRevenue: number;
    totalOrders: number;
    averageTicket: number;
    totalCustomers: number;
    chartData: number[];
    chartLabels: string[];
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) {}

    getDashboardMetrics(startDate?: string, endDate?: string): Observable<DashboardMetrics> {
        let params = new HttpParams();
        if (startDate) {
            params = params.set('startDate', startDate);
        }
        if (endDate) {
            params = params.set('endDate', endDate);
        }
        
        return this.http.get<DashboardMetrics>(this.apiUrl, { params });
    }
}