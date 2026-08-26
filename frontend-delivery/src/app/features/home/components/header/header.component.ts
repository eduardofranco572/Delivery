import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { TenantService } from '../../../../core/services/tenant.service';
import { CompanyInfo } from '../../../../core/models/global.models';

@Component({
    selector: 'app-home-header',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
    isModalOpen = false;
    company: CompanyInfo | null = null;
    
    logoUrl: string = 'complogo.jpg';
    bannerUrl: string = 'compbanner.jpg';

    constructor(
        private http: HttpClient,
        private tenantService: TenantService,
        private cdr: ChangeDetectorRef 
    ) {}

    ngOnInit() {
        const companyId = this.tenantService.getCompanyId();
        
        this.http.get<CompanyInfo>(`${environment.apiUrl}/company/${companyId}`).subscribe({
            next: (data) => {
                this.company = data;
                const baseUrl = environment.apiUrl.replace('/api', '');
                
                if (data.empLogo) {
                    this.logoUrl = `${baseUrl}/uploads/company/imgs/${data.empLogo}`;
                }
                if (data.empBanner) {
                    this.bannerUrl = `${baseUrl}/uploads/company/imgs/${data.empBanner}`;
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao buscar dados da empresa', err);
            }
        });
    }

    openDetailsModal() {
        this.isModalOpen = true;
    }

    closeDetailsModal() {
        this.isModalOpen = false;
    }
}