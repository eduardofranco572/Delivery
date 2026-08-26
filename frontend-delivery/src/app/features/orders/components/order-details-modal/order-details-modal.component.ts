import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { LucideAngularModule } from 'lucide-angular';
import { OrderResponse } from '../../models/order.models';
import { OrderService } from '../../order.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
    selector: 'app-order-details-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
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

    get statusInfo() {
        switch(this.order.status) {
            case 'PENDING': return { 
                label: 'Aguardando', 
                class: 'bg-primary/20 text-primary border-primary/30' 
            };

            case 'PREPARING': return { 
                label: 'Preparando', 
                class: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' 
            };

            case 'DELIVERING': return { 
                label: 'Saiu p/ Entrega', 
                class: 'bg-blue-500/20 text-blue-500 border-blue-500/30' 
            };

            case 'COMPLETED': return { 
                label: 'Concluído', 
                class: 'bg-green/20 text-green border-green/30' 
            };
            
            case 'CANCELLED': return { 
                label: 'Cancelado', 
                class: 'bg-red-500/20 text-red-500 border-red-500/30' 
            };

            default: return { 
                label: this.order.status, 
                class: 'bg-gray text-subtext border-gray' 
            };
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