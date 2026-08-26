import { Component, input, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { CartItemResponse } from '../../../cart/models/cart.models';

@Component({
    selector: 'app-checkout-items',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './checkout-items.component.html'
})
export class CheckoutItemsComponent {
    @Input() items: CartItemResponse[] = [];
    @Input() isLoading: boolean = true;
}