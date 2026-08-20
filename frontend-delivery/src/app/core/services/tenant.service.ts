import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TenantService {
    private currentCompanyId: number;

    constructor() {
        this.currentCompanyId = this.resolveCompanyId();
    }

    //Helper para descobrir a empresa atual.
    private resolveCompanyId(): number {
        // const hostname = window.location.hostname;
        // const subdomain = hostname.split('.')[0];

        return environment.defaultCompanyId;
    }

    getCompanyId(): number {
        return this.currentCompanyId;
    }
}