import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Group, PaginatedResponse } from './models/group.models';

@Injectable({ providedIn: 'root' })
export class AdminGroupService {
    private apiUrl = `${environment.apiUrl}/admin/groups`;

    constructor(private http: HttpClient) {}

    getGroups(page: number = 1, limit: number = 50, search: string = ''): Observable<PaginatedResponse<Group>> {
        let params = new HttpParams()
            .set('page', page.toString())
            .set('limit', limit.toString());
            
        if (search) {
            params = params.set('search', search);
        }

        return this.http.get<{ data: any[], total: number }>(this.apiUrl, { params });
    }

    getGroupById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createGroup(data: any): Observable<any> {
        return this.http.post(this.apiUrl, data);
    }

    updateGroup(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data);
    }

    deleteGroup(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}