import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AdminProductService } from './admin-product.service';
import { AlertService } from '../../../core/services/alert.service';
import { AdminTableComponent, TableColumn } from '../components/admin-table/admin-table.component';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, AdminTableComponent],
    templateUrl: './admin-products.component.html'
})
export class AdminProductsComponent implements OnInit, OnDestroy {
    products: any[] = [];
    isLoading = true;
    isLoadingMore = false;

    currentPage = 1;
    pageSize = 50;
    hasMore = false;
    searchQuery = '';
    searchSubject = new Subject<string>();

    productColumns: TableColumn[] = [
        { key: 'prodCode', label: 'Cód.', type: 'text' },
        { key: 'prodName', label: 'Produto', type: 'image-text', imageKey: 'prodImageUrl' },
        { key: 'prodGroup', label: 'Grupo', type: 'text' },
        { key: 'prodOriginalPrice', label: 'Preço', type: 'currency' }
    ];

    constructor(
        private router: Router,
        private productService: AdminProductService,
        private alertService: AlertService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(query => {
            this.searchQuery = query;
            this.currentPage = 1;
            this.products = [];
            this.loadProducts();
        });

        this.loadProducts();
    }

    ngOnDestroy() {
        this.searchSubject.complete();
    }

    onSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        this.searchSubject.next(target.value);
    }

    loadProducts() {
        if (this.currentPage === 1) {
            this.isLoading = true;
        } else {
            this.isLoadingMore = true;
        }

        this.productService.getProducts(this.currentPage, this.pageSize, this.searchQuery).subscribe({
            next: (response) => {
                if (this.currentPage === 1) {
                    this.products = response.data || [];
                    
                } else {
                    this.products = [...this.products, ...(response.data || [])];
                }
                
                this.hasMore = this.products.length < response.total;
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível carregar os produtos.');
                this.isLoading = false;
                this.isLoadingMore = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadMore() {
        this.currentPage++;
        this.loadProducts();
    }

    goToNewProduct() {
        this.router.navigate(['/admin/products/novo']);
    }

    goToEditProduct(id: number) {
        this.router.navigate(['/admin/products', id]);
    }
}