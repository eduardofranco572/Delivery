import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from './order.service';
import { OrderResponse } from './models/order.models';
import { OrderDetailsModalComponent } from './components/order-details-modal/order-details-modal.component';
import { OrderStatusPipe } from '../../shared/pipes/order-status.pipe';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterModule, DialogModule, OrderStatusPipe],
    templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {
    orders: OrderResponse[] = [];
    isLoading = true;

    constructor(
        private location: Location,
        private authService: AuthService,
        private orderService: OrderService,
        private dialog: Dialog,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        const userId = this.authService.getUserId();
        if (!userId) {
            this.isLoading = false;
            this.cdr.detectChanges();
            return;
        }

        this.isLoading = true;
        this.cdr.detectChanges();

        this.orderService.getUserOrders(userId).subscribe({
            next: (data) => {
                if (Array.isArray(data)) {
                    this.orders = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                } else {
                    this.orders = [];
                }
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erro ao buscar pedidos', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    goBack() {
        this.location.back();
    }

    openOrderDetails(order: OrderResponse) {
        const dialogRef = this.dialog.open(OrderDetailsModalComponent, {
            data: order,
            hasBackdrop: true,
            backdropClass: ['bg-black/70', 'backdrop-blur-sm'],
            panelClass: ['w-full', 'px-4', 'bg-transparent', 'shadow-none']
        });

        dialogRef.closed.subscribe((needsReload) => {
            if (needsReload) {
                this.loadOrders();
            }
        });
    }
}