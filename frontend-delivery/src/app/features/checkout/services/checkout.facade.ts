import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';
import { TenantService } from '../../../core/services/tenant.service';
import { CartService } from '../../cart/cart.service';
import { CheckoutApiService } from './checkout-api.service';
import { CheckoutCartService } from './checkout-cart.service';
import { CheckoutAddressService } from './checkout-address.service';
import { DistanceService } from '../../../core/services/distance.service';
import { CompanyInfo } from '../../../core/models/global.models';
import { PlaceOrderPayload } from '../models/checkout.models';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
    freightValue = signal<number | null>(null);
    companyInfo = signal<CompanyInfo | null>(null);

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
        private distanceService: DistanceService,
        private router: Router
    ) {
        effect(() => {
            const company = this.companyInfo();
            const userAddress = this.addressState.userAddress();

            if (company && userAddress) {
                this.calculateDynamicFreight(company, userAddress);
            }
        });
    }

    initCheckout() {
        this.cartState.loadCart();
        this.addressState.loadAddresses();
        this.loadCompanyData();
    }

    loadCompanyData() {
        const companyId = this.tenantService.getCompanyId();
        this.checkoutApi.getCompanyInfo(companyId).subscribe({
            next: (company) => {
                this.companyInfo.set(company);
            },
            error: (err) => {
                console.error('Erro ao buscar dados da empresa', err);
                this.freightValue.set(0); 
            }
        });
    }

    private async calculateDynamicFreight(company: CompanyInfo, userAddress: any) {
        this.freightValue.set(null);
        
        const basePricePerKm = company.empFreteBase || 0;
        
        const origin = `${company.empStreet}, ${company.empCity} - ${company.empState}, Brasil`;
        const destination = `${userAddress.street}, ${userAddress.city} - ${userAddress.state}, Brasil`;

        try {
            const distanceInKm = await this.distanceService.calculateDistance(origin, destination);
            
            const calculatedFreight = distanceInKm * basePricePerKm;
            this.freightValue.set(Number(calculatedFreight.toFixed(2)));

        } catch (error) {
            console.error(error);
            this.alertService.warning('Atenção', 'Usando taxa de entrega padrão.');
            this.freightValue.set(basePricePerKm * 3);
        }
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

        const address = this.addressState.userAddress();
        if (!address) {
            this.alertService.warning('Atenção', 'Selecione um endereço de entrega para continuar.');
            return;
        }

        if (this.paymentMethod() === 'cash' && !this.changeFor()) {
            this.alertService.warning('Atenção', 'Informe para quanto precisa de troco.');
            return;
        }

        const userId = this.authService.getUserId();
        if (!userId) return;

        this.isSubmitting.set(true);

        const payload: PlaceOrderPayload = {
            paymentMethod: this.paymentMethod(),
            changeFor: this.changeFor() || null,
            freightValue: currentFreight,
            address: address
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