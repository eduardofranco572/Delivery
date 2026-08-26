import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminPreferenceService } from '../admin-preference.service';
import { AdminProductService } from '../../products/admin-product.service';
import { AlertService } from '../../../../core/services/alert.service';
import { FormInputComponent } from '../../../../shared/components/form-input/form-input.component';

@Component({
    selector: 'app-admin-preference-details',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, NgSelectModule, FormInputComponent],
    templateUrl: './admin-preference-details.component.html'
})
export class AdminPreferenceDetailsComponent implements OnInit {
    prefForm: FormGroup;
    isEditMode = false;
    prefId!: number;
    isSaving = false;
    
    preferenceGroups: any[] = [];

    constructor(
        private fb: FormBuilder,
        private location: Location,
        private route: ActivatedRoute,
        private router: Router,
        private preferenceService: AdminPreferenceService,
        private productService: AdminProductService,
        private alertService: AlertService
    ) {
        this.prefForm = this.fb.group({
            prefCode: ['', Validators.required],
            prefName: ['', Validators.required],
            prefType: [''],
            prefDescription: [''],
            prefQtd: [null],
            prefPrice: ['0,00'],
            groupIds: [[]]
        });
    }

    ngOnInit() {
        this.loadGroups();

        this.route.paramMap.subscribe(params => {
            const id = params.get('id');

            if (id && id !== 'novo') {
                this.isEditMode = true;
                this.prefId = Number(id);
                this.loadData(this.prefId);
            }
        });
    }

    loadGroups() {
        this.productService.getPreferenceGroups().subscribe({
            next: (groups) => {
                this.preferenceGroups = groups
            },
            error: () => {
                console.error('Erro ao carregar grupos')
            }
        });
    }

    loadData(id: number) {
        this.preferenceService.getPreferenceById(id).subscribe({
            next: (data) => {
                const formattedPrice = 
                    data.prefPrice !== undefined && 
                    data.prefPrice !== null ? 
                    data.prefPrice.toFixed(2).replace('.', ',') : '0,00';

                const groupIds = 
                    data.groups && 
                    data.groups.length > 0 ? 
                    data.groups.map((g: any) => g.id) : [];

                this.prefForm.patchValue({
                    ...data,
                    prefPrice: formattedPrice,
                    groupIds: groupIds
                });
            },
            error: () => this.alertService.error('Erro', 'Não foi possível carregar os dados.')
        });
    }

    onPriceInput(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value.replace(/\D/g, '');

        if (!value) {
            this.prefForm.patchValue({ prefPrice: '' });
            return;
        }

        const numberValue = (parseInt(value, 10) / 100).toFixed(2);
        const formattedValue = numberValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        this.prefForm.patchValue({ prefPrice: formattedValue }, { emitEvent: false });
    }

    savePreference() {
        if (this.prefForm.invalid) {
            this.alertService.warning('Atenção', 'Preencha todos os campos obrigatórios.');
            return;
        }
        
        this.isSaving = true;
        let payload = { ...this.prefForm.value };
        
        if (payload.prefPrice) {
            payload.prefPrice = parseFloat(payload.prefPrice.replace(/\./g, '').replace(',', '.'));

        } else {
            payload.prefPrice = 0;
        }

        const request$ = this.isEditMode 
            ? this.preferenceService.updatePreference(this.prefId, payload)
            : this.preferenceService.createPreference(payload);

        request$.subscribe({
            next: () => {
                this.alertService.success('Sucesso', `Preferência salva com sucesso!`);
                this.isSaving = false;
                this.goBack();
            },
            error: (err) => {
                this.alertService.error('Erro', err.error?.message || 'Falha ao salvar.');
                this.isSaving = false;
            }
        });
    }

    deletePreference() {
        if (!this.prefId) return;

        if (confirm('Tem certeza que deseja excluir esta preferência?')) { ///////
            this.preferenceService.deletePreference(this.prefId).subscribe({
                next: () => {
                    this.alertService.success('Excluído', 'Preferência removida com sucesso!');
                    this.goBack();
                },
                error: () => {
                    this.alertService.error('Erro', 'Não foi possível excluir.')
                }
            });
        }
    }

    goBack() {
        this.location.back();
    }
}