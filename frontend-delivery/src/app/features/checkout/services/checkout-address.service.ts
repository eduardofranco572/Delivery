import { Injectable, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CheckoutApiService } from './checkout-api.service';

@Injectable({ providedIn: 'root' })
export class CheckoutAddressService {
    addresses = signal<any[]>([]);
    userAddress = signal<any>(null);
    showAddressModal = signal<boolean>(false);

    constructor(
        private authService: AuthService,
        private checkoutApi: CheckoutApiService
    ) {}

    loadAddresses() {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.checkoutApi.getUserAddresses(userId).subscribe({
            next: (data) => {
                this.addresses.set(data);
                if (data.length > 0) {
                    this.userAddress.set(data[0]);
                }
            },
            error: (err) => console.error('Erro ao carregar endereços', err)
        });
    }

    openModal() { 
        this.showAddressModal.set(true); 
    }

    closeModal() { 
        this.showAddressModal.set(false); 
    }
    
    selectAddress(address: any) {
        this.userAddress.set(address);
        this.closeModal();
    }
}