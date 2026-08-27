import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-address-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './address-form-modal.component.html'
})
export class AddressFormModalComponent implements OnInit {
    addressForm: FormGroup;
    isEdit = false;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private alertService: AlertService,
        public dialogRef: DialogRef<any>,
        
        @Inject(DIALOG_DATA) public data: any
    ){
        this.addressForm = this.fb.group({
            id: [null],
            cep: ['', [Validators.required, Validators.minLength(8)]],
            street: ['', [Validators.required]],
            number: ['', Validators.required],
            neighborhood: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.required],
            type: [''],
            isDefault: [false]
        });
    }

    ngOnInit() {
        if (this.data?.address) {
            this.isEdit = true;
            this.addressForm.patchValue(this.data.address);
        }
    }

    onCepChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const cep = input.value.replace(/\D/g, '');

        if (cep.length === 8) {
            this.http.get(`${environment.viaCepUrl}/${cep}/json/`).subscribe({
                next: (response: any) => {
                    if (!response.erro) {
                        this.addressForm.patchValue({
                            street: response.logradouro,
                            neighborhood: response.bairro,
                            city: response.localidade,
                            state: response.uf  
                        });
                    } else {
                        this.alertService.warning('Atenção', 'CEP não encontrado.');
                    }
                },
                error: () => {
                    this.alertService.error('Erro', 'Não foi possível buscar o CEP.')
                },
            });
        }
    }

    close() {
        this.dialogRef.close();
    }

    save() {
        if (this.addressForm.invalid) return;

        this.isSubmitting = true;
        
        this.dialogRef.close({
            action: 'save',
            address: this.addressForm.value
        });
    }



}