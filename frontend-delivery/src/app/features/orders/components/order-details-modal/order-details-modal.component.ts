import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { OrderResponse } from '../../models/order.models';
import { OrderService } from '../../order.service';
import { AlertService } from '../../../../core/services/alert.service';
import { OrderStatusPipe } from '../../../../shared/pipes/order-status.pipe';

@Component({
    selector: 'app-order-details-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, OrderStatusPipe],
    templateUrl: './order-details-modal.component.html'
})
export class OrderDetailsModalComponent {
    order: OrderResponse;
    parsedAddress: any = null;
    isCancelling = false;

    constructor(
        public dialogRef: DialogRef<boolean>,
        @Inject(DIALOG_DATA) public data: OrderResponse,
        private orderService: OrderService,
        private alertService: AlertService
    ) {
        this.order = data;
        try {
            this.parsedAddress = typeof data.deliveryAddress === 'string' 
                ? JSON.parse(data.deliveryAddress) 
                : data.deliveryAddress;
        } catch (e) {
            this.parsedAddress = null;
        }
    }

    get canCancel(): boolean {
        return this.order.status === 'PENDING' || this.order.status === 'PREPARING';
    }

    close() {
        this.dialogRef.close(false);
    }

    cancelOrder() {
        this.isCancelling = true;

        this.orderService.cancelOrder(this.order.id).subscribe({
            next: () => {
                this.alertService.success('Cancelado', 'Pedido cancelado com sucesso.');
                this.isCancelling = false;
                this.dialogRef.close(true);
            },
            error: () => {
                this.alertService.error('Erro', 'Não foi possível cancelar o pedido.');
                this.isCancelling = false;
            }
        });
    }
}