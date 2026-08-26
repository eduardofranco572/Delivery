import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CompanyInfo } from '../../../core/models/global.models'

@Injectable({ providedIn: 'root' })
export class AdminCompanyService {
    private apiUrl = `${environment.apiUrl}/admin/company`;

    constructor(private http: HttpClient) {}

    getCompany(id: number): Observable<CompanyInfo> {
        return this.http.get<CompanyInfo>(`${this.apiUrl}/${id}`);
    }

    updateCompany(id: number, formData: FormData): Observable<CompanyInfo> {
        return this.http.put<CompanyInfo>(`${this.apiUrl}/${id}`, formData);
    }
}