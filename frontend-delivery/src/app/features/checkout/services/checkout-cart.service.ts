import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AlertService } from '../../../core/services/alert.service';

@Injectable({ providedIn: 'root' })
export class CheckoutCartService {
    cartData = signal<any>({ items: [], cartTotal: 0 });
    isLoading = signal<boolean>(true);

    constructor(
        private cartApi: CartService,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router
    ) {}

    loadCart() {
        const userId = this.authService.getUserId();
        if (!userId) {
            this.router.navigate(['/login']);
            return;
        }

        this.isLoading.set(true);

        this.cartApi.getCart(userId).subscribe({
            next: (data) => {
                this.cartData.set(data);
                
                if (!data?.items || data.items.length === 0) {
                    this.alertService.warning('Atenção', 'Seu carrinho está vazio.');
                    this.router.navigate(['/home']);
                    return; 
                }
                this.isLoading.set(false);
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar o pedido.');
                this.isLoading.set(false);
            }
        });
    }
}