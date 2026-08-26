import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, Category, PreferenceGroup } from '../../../core/models/domain.models';
import { PaginatedResponse } from '../../../core/models/pagination.model';

@Injectable({ providedIn: 'root' })
export class AdminProductService {
    private apiUrl = `${environment.apiUrl}/admin/product`;

    constructor(private http: HttpClient) {}

    getProducts(page: number = 1, limit: number = 50, search: string = ''): Observable<PaginatedResponse<Product>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
            
        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResponse<Product>>(this.apiUrl, { params });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${id}`);
    }

    createProduct(formData: FormData): Observable<{ message: string; productId: number }> {
        return this.http.post<{ message: string; productId: number }>(this.apiUrl, formData);
    }

    updateProduct(id: number, formData: FormData): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.apiUrl}/${id}`, formData);
    }

    deleteProduct(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }

    getPreferenceGroups(): Observable<PreferenceGroup[]> {
        return this.http.get<PreferenceGroup[]>(`${this.apiUrl}/aux/preferences`);
    }

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/aux/categories`);
    }
}