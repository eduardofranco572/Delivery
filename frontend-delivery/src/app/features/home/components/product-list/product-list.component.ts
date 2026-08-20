import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { HomeService } from '../../services/home.service';
import { CartService } from '../../../cart/services/cart.service'
import { AuthService } from '../../../../core/services/auth.service';
import { AlertService } from '../../../../core/services/alert.service';
import { ItemDetailsComponent } from '../../../../shared/components/item-details/item-details.component';

import { Category, Product } from '../../../../core/models/domain.models';
import { CartPayload } from '../../../cart/models/cart.models';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [LucideAngularModule, CommonModule, DialogModule],
    templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
    catalog: Category[] = [];
    filteredCatalogList: Category[] = [];
    activeCategory: string = 'Todos';
    searchQuery: string = '';

    constructor(
        private homeService: HomeService,
        private cartService: CartService,
        private authService: AuthService,
        private alertService: AlertService,
        private router: Router,
        private dialog: Dialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.homeService.getCatalog().subscribe({
            next: (data) => {
                this.catalog = data;
                this.updateFilteredCatalog();
            },
            error: (err) => console.error('Erro na requisição:', err)
        });
    }

    setCategory(categoryName: string) {
        this.activeCategory = categoryName;
        this.updateFilteredCatalog();
    }

    onSearch(event: Event) {
        const input = event.target as HTMLInputElement;
        this.searchQuery = (input.value || '').toLowerCase();
        this.updateFilteredCatalog();
    }

    updateFilteredCatalog() {
        try {
            if (!this.catalog) return;

            this.filteredCatalogList = this.catalog.map(category => {
                const products = category.products || [];

                const filteredProducts = products.filter((p: Product) => {
                    const name = p.prodName;

                    return name.toLowerCase().includes(this.searchQuery);
                    
                });

                return { ...category, products: filteredProducts };

            }).filter(category => 
                (this.activeCategory === 'Todos' || this.activeCategory === category.catName) && 
                category.products && category.products.length > 0
            );

            this.cdr.detectChanges();

        } catch (error) {
            console.error('Erro ao filtrar produtos:', error);
        }
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
                this.alertService.error('Erro', 'Não foi possível carregar o produto.');
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
                this.cartService.updateCartCount(userId);
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível adicionar o item.');
            }
        });
    }
}