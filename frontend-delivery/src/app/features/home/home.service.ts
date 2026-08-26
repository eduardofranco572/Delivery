import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, Product } from '../../core/models/domain.models';

@Injectable({
    providedIn: 'root'
})
export class HomeService {
    private apiUrl = `${environment.apiUrl}/home`;

    constructor(private http: HttpClient) {}

    getCatalog(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/catalog`);
    }

    getProductDetails(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
    }
}