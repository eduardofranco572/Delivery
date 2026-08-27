import { Component, computed, signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { HomeService } from '../../home.service';
import { CartService } from '../../../cart/cart.service';
import { AuthService } from '../../../../core/services/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ItemDetailsComponent } from '../../../../shared/components/item-details/item-details.component';
import { Product } from '../../../../core/models/domain.models';
import { CartPayload } from '../../../cart/models/cart.models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [LucideAngularModule, CommonModule, DialogModule],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent {
    private homeService = inject(HomeService);
    private cartService = inject(CartService);
    private authService = inject(AuthService);
    private alertService = inject(AlertService);
    private router = inject(Router);
    private dialog = inject(Dialog);

    activeCategory = signal<string>('Todos');
    searchQuery = signal<string>('');

    catalog = toSignal(this.homeService.getCatalog(), { initialValue: [] });

    filteredCatalogList = computed(() => {
        const currentCatalog = this.catalog();
        const category = this.activeCategory();
        const query = this.searchQuery();

        if (!currentCatalog) return [];

        return currentCatalog.map(cat => {
            const products = cat.products || [];

            const filteredProducts = products.filter((p: Product) =>
                p.prodName.toLowerCase().includes(query)
            );

            return { ...cat, products: filteredProducts };

        }).filter(categoryItem =>
            (category === 'Todos' || category === categoryItem.catName) &&
            categoryItem.products && categoryItem.products.length > 0
        );
    });

    setCategory(categoryName: string) {
        this.activeCategory.set(categoryName);
    }

    onSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchQuery.set((input.value || '').toLowerCase());
    }

    openProductDetails(productId: number) {
        this.homeService.getProductDetails(productId).subscribe({
            next: (productData) => {
                const dialogRef = this.dialog.open<CartPayload>(ItemDetailsComponent, {
                    data: productData,
                    hasBackdrop: true,
                    backdropClass: ['bg-black/70', 'backdrop-blur-sm'],
                    panelClass: ['w-full', 'md:w-[28rem]', 'lg:w-[40%]', 'h-full', '!fixed', '!right-0', '!inset-y-0', 'animate-slide-in-right'],
                });

                dialogRef.closed.subscribe((result) => {
                    if (result) {
                        this.processAddToCart(result);
                    }
                });
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar o produto.')
            }
        });
    }

    private processAddToCart(payload: CartPayload) {
        const userId = this.authService.getUserId();

        if (!userId) {
            this.router.navigate(['/404']);
            return;
        }

        this.cartService.addItem(userId, payload).subscribe({
            next: () => {
                this.cartService.updateCartCount(userId)
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível adicionar o item.')
            }
        });
    }
}