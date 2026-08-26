import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Preference } from '../../../core/models/domain.models';
import { PaginatedResponse } from '../../../core/models/pagination.model';

export type PreferencePayload = Omit<Preference, 'id'>;

@Injectable({ providedIn: 'root' })
export class AdminPreferenceService {
    private apiUrl = `${environment.apiUrl}/admin/preferences`;

    constructor(private http: HttpClient) {}

    getPreferences(page: number = 1, limit: number = 50, search: string = ''): Observable<PaginatedResponse<Preference>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
            
        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<PaginatedResponse<Preference>>(this.apiUrl, { params });
    }

    getPreferenceById(id: number): Observable<Preference> {
        return this.http.get<Preference>(`${this.apiUrl}/${id}`);
    }

    createPreference(data: PreferencePayload): Observable<Preference> {
        return this.http.post<Preference>(this.apiUrl, data);
    }

    updatePreference(id: number, data: Partial<PreferencePayload>): Observable<Preference> {
        return this.http.put<Preference>(`${this.apiUrl}/${id}`, data);
    }

    deletePreference(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
    }
}