import { Injectable, signal, computed } from '@angular/core'; 
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { TenantService } from '../../../core/services/tenant.service';
import { CartService } from '../../cart/services/cart.service';

import { CheckoutApiService } from './checkout-api.service';
import { CheckoutCartService } from './checkout-cart.service';
import { CheckoutAddressService } from './checkout-address.service';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
    freightValue = signal<number | null>(null); 
    paymentMethod = signal<'pix' | 'card' | 'cash'>('pix');
    changeFor = signal<string>('');
    isSubmitting = signal<boolean>(false);
    showSuccessModal = signal<boolean>(false);

    constructor(
        public cartState: CheckoutCartService,
        public addressState: CheckoutAddressService,
        private checkoutApi: CheckoutApiService,
        private globalCartService: CartService,
        private authService: AuthService,
        private tenantService: TenantService,
        private alertService: AlertService,
        private router: Router
    ) {}

    initCheckout() {
        this.cartState.loadCart();
        this.addressState.loadAddresses();
        this.loadFreight(); 
    }

    loadFreight() {
        const companyId = this.tenantService.getCompanyId();

        this.checkoutApi.getCompanyInfo(companyId).subscribe({
            next: (company) => {
                this.freightValue.set(company.empFreteBase || 0);
            },
            error: (err) => {
                console.error('Erro ao buscar taxa de entrega da empresa', err);
                this.alertService.error('Ops!', 'Não foi possível carregar a taxa de entrega. Atualize a página e tente novamente.');
                this.freightValue.set(null); 
            }
        });
    }

    totalOrder = computed(() => {
        const cartTotal = this.cartState.cartData()?.cartTotal || 0;
        const freight = this.freightValue() || 0;
        return cartTotal + freight;
    });

    placeOrder() {
        const currentFreight = this.freightValue();

        if (currentFreight === null) {
            this.alertService.error('Erro', 'Aguarde o cálculo da taxa de entrega para continuar.');
            return;
        }

        if (this.paymentMethod() === 'cash' && !this.changeFor()) {
            this.alertService.warning('Atenção', 'Informe para quanto precisa de troco.');
            return;
        }

        const userId = this.authService.getUserId();
        if (!userId) return;

        this.isSubmitting.set(true);

        const payload = {
            companyId: this.tenantService.getCompanyId(),
            paymentMethod: this.paymentMethod(),
            changeFor: this.changeFor(),
            freightValue: currentFreight,
            address: this.addressState.userAddress() 
        };

        this.checkoutApi.placeOrder(userId, payload).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.globalCartService.updateCartCount(userId); 
                
                this.showSuccessModal.set(true);

                setTimeout(() => {
                    this.showSuccessModal.set(false);
                    this.router.navigate(['/home']);
                }, 3500);
            },
            error: (err) => {
                this.isSubmitting.set(false);
                this.alertService.error('Erro', err.error?.message || 'Falha ao finalizar o pedido.');
            }
        });
    }
}