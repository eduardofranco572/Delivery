import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { FormInputComponent } from '../../shared/components/form-input/form-input.component';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from './profile.service';
import { AlertService } from '../../core/services/alert.service';

import { AddressListModalComponent } from './components/address-list-modal/address-list-modal.component';
import { AddressFormModalComponent } from './components/address-form-modal/address-form-modal.component';

import { Address } from '../../core/models/global.models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, DialogModule, FormInputComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
    userForm: FormGroup;
    addresses: Address[] = [];
    defaultAddress: Address | null = null;
    
    isSavingUser = false;
    isLoadingAddresses = true;
    
    private userId!: number;

    constructor(
        private location: Location,
        private fb: FormBuilder,
        private authService: AuthService,
        private profileService: ProfileService,
        private alertService: AlertService,
        private dialog: Dialog
    ) {
        this.userForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    ngOnInit() {
        const id = this.authService.getUserId();

        if (!id) {
            this.goBack(); 
            return;
        }
        
        this.userId = id;
        this.loadUserData();
        this.loadAddresses();
    }

    loadUserData() {
        this.profileService.getUser(this.userId).subscribe({
            next: (user) => {
                this.userForm.patchValue({
                name: user.name,
                email: user.email
                });
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar os dados.')
            }
        });
    }

    saveUser() {
        if (this.userForm.invalid) return;

        this.isSavingUser = true;

        this.profileService.updateUser(this.userId, this.userForm.value).subscribe({
            next: () => {
                this.alertService.success('Sucesso', 'Dados atualizados com sucesso.');
                this.isSavingUser = false;
            },
            error: () => {
                this.alertService.error('Erro', 'Falha ao atualizar dados.');
                this.isSavingUser = false;
            }
        });
    }

    loadAddresses() {
        this.isLoadingAddresses = true;
        
        this.profileService.getAddresses(this.userId).subscribe({
            next: (data) => {
                this.addresses = data;
                this.defaultAddress = data.find((a: any) => a.isDefault) || data[0] || null;
                this.isLoadingAddresses = false;
            },
            error: () => {
                this.alertService.error('Erro', 'Falha ao carregar endereços.');
                this.isLoadingAddresses = false;
            }
        });
    }

    openAddressList() {
        const dialogRef = this.dialog.open(AddressListModalComponent, {
            data: { addresses: this.addresses },
            hasBackdrop: true,
            backdropClass: ['bg-black/70', 'backdrop-blur-sm'], // <-- ATUALIZADO AQUI
            panelClass: ['w-full', 'px-4', 'bg-transparent', 'shadow-none']
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.action === 'edit') {
                this.openAddressForm(result.address);
            }
        });
    }

    openAddressForm(address: any = null) {
        const dialogRef = this.dialog.open(AddressFormModalComponent, {
            data: { address },
            hasBackdrop: true,
            backdropClass: ['bg-black/70', 'backdrop-blur-sm'], // <-- ATUALIZADO AQUI
            panelClass: ['w-full', 'px-4', 'bg-transparent', 'shadow-none']
        });

        dialogRef.closed.subscribe((result: any) => {
            if (result?.action === 'save') {
                const request$ = result.address.id 
                    ? this.profileService.updateAddress(result.address.id, result.address)
                    : this.profileService.createAddress(this.userId, result.address);

                request$.subscribe({
                    next: () => {
                        this.alertService.success('Sucesso', 'Endereço salvo com sucesso.');
                        this.loadAddresses();
                    },
                    error: () => {
                        this.alertService.error('Erro', 'Não foi possível salvar o endereço.')
                    }
                });
            }
        });
    }

    goBack() {
        this.location.back();
    }
}