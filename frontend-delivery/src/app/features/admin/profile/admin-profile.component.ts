import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { AdminCompanyService } from './admin-company.service';
import { AlertService } from '../../../core/services/alert.service';
import { environment } from '../../../../environments/environment';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';

@Component({
    selector: 'app-admin-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, FormInputComponent],
    templateUrl: './admin-profile.component.html'
})
export class AdminProfileComponent implements OnInit {
    companyForm: FormGroup;
    companyId = environment.defaultCompanyId;
    isSaving = false;

    logoPreview: string | null = null;
    bannerPreview: string | null = null;
    
    selectedLogoFile: File | null = null;
    selectedBannerFile: File | null = null;

    constructor(
        private fb: FormBuilder,
        private companyService: AdminCompanyService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {
        this.companyForm = this.fb.group({
            empName: ['', Validators.required],
            empNameFantasy: ['', Validators.required],
            empCnpj: ['', Validators.required],
            empCep: ['', Validators.required],
            empStreet: ['', Validators.required],
            empNeighborhood: ['', Validators.required],
            empCity: ['', Validators.required],
            empState: ['', Validators.required],
            empFreteBase: [0, Validators.required]
        });
    }

    ngOnInit() {
        this.loadCompanyData();
    }

    loadCompanyData() {
        this.companyService.getCompany(this.companyId).subscribe({
            next: (data) => {
                this.companyForm.patchValue(data);
                
                const baseUrl = environment.apiUrl.replace('/api', '');
                
                if (data.empLogo) {
                    this.logoPreview = `${baseUrl}/uploads/company/imgs/${data.empLogo}`;
                }
                if (data.empBanner) {
                    this.bannerPreview = `${baseUrl}/uploads/company/imgs/${data.empBanner}`;
                }
            },
            error: () => this.alertService.error('Erro', 'Não foi possível carregar os dados da empresa.')
        });
    }

    onLogoSelected(event: Event) {
        const input = event.target as HTMLInputElement | null;
        const file = input?.files?.[0];
        
        if (file) {
            this.selectedLogoFile = file;
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.logoPreview = e.target?.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    onBannerSelected(event: Event) {
        const input = event.target as HTMLInputElement | null;
        const file = input?.files?.[0];
        
        if (file) {
            this.selectedBannerFile = file;
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.bannerPreview = e.target?.result as string;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    saveCompany() {
        if (this.companyForm.invalid) {
            this.alertService.warning('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }

        this.isSaving = true;
        const formData = new FormData();
        const formValues = this.companyForm.value;

        Object.keys(formValues).forEach(key => {
            formData.append(key, formValues[key]);
        });

        if (this.selectedLogoFile) {
            formData.append('logo', this.selectedLogoFile);
        }
        if (this.selectedBannerFile) {
            formData.append('banner', this.selectedBannerFile);
        }

        this.companyService.updateCompany(this.companyId, formData).subscribe({
            next: () => {
                this.alertService.success('Sucesso', 'Dados da empresa atualizados!');
                this.isSaving = false;
            },
            error: () => {
                this.alertService.error('Erro', 'Falha ao salvar as alterações.');
                this.isSaving = false;
            }
        });
    }
}