import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CartService } from './services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
    cartData: any = { items: [], cartTotal: 0 };
    isLoading = false;

    constructor(
        private cartService: CartService,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,
        public dialogRef: DialogRef<void>,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadCart();
    }

    loadCart() {
        const userId = this.authService.getUserId();

        if (!userId) {
            this.closeCart();
            this.router.navigate(['/404']);
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges();

        this.cartService.getCart(userId).subscribe({
            next: (data) => {
                this.cartData = data;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar o carrinho.');
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    closeCart() {
        this.dialogRef.close();
    }

    removeItem(cartItemId: string) {
        const userId = this.authService.getUserId();
        if (!userId) return;

        this.cartService.removeItem(userId, cartItemId).subscribe({
            next: () => {
                this.loadCart();
                this.cartService.updateCartCount(userId);
            },
            error: () => this.alertService.error('Erro', 'Não foi possível remover o item.')
        });
    }

    updateQty(cartItemId: string, currentQty: number, change: number) {
        const newQty = currentQty + change;
        if (newQty < 1) return;

        const userId = this.authService.getUserId();
        if (!userId) return;

        this.cartService.updateItemQuantity(userId, cartItemId, newQty).subscribe({
            next: () => {
                this.loadCart();
                this.cartService.updateCartCount(userId);
            },
            error: () => this.alertService.error('Erro', 'Não foi possível atualizar a quantidade.')
        });
    }

    continueToCheckout() {
        this.closeCart();
        this.router.navigate(['/checkout']);
    }
}