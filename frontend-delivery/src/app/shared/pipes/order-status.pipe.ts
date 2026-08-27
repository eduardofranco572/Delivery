import { Pipe, PipeTransform } from '@angular/core';
import { getOrderStatusConfig } from '../../core/constants/order-status.constants';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {
    transform(status: string, type: string = 'label'): string {
        const config = getOrderStatusConfig(status);
        return (config as Record<string, string>)[type] || status;
    }
}