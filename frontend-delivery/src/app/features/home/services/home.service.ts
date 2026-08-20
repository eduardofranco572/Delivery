import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TenantService } from '../../../core/services/tenant.service';
import { Category, Product } from '../../../core/models/domain.models';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private apiUrl = `${environment.apiUrl}/home`;

    constructor(
        private http: HttpClient,
        private tenantService: TenantService 
    ) {}

    getCatalog(): Observable<Category[]> {
        const companyId = this.tenantService.getCompanyId();
        return this.http.get<Category[]>(`${this.apiUrl}/catalog?companyId=${companyId}`);
    }

    getProductDetails(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
    }
}