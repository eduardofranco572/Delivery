import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

import { AddressModalComponent } from './components/address-modal/address-modal.component';
import { CheckoutItemsComponent } from './components/checkout-items/checkout-items.component';
import { PaymentSelectorComponent } from './components/payment-selector/payment-selector.component';
import { SuccessModalComponent } from './components/success-modal/success-modal.component';

import { CheckoutFacade } from './services/checkout.facade';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [
        CommonModule, 
        LucideAngularModule, 
        FormsModule, 
        AddressModalComponent,
        CheckoutItemsComponent,
        PaymentSelectorComponent,
        SuccessModalComponent
    ], 
    templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
    
    constructor(
        public facade: CheckoutFacade,
        private location: Location
    ) {}

    ngOnInit() {
        this.facade.initCheckout();
    }

    goBack() {
        this.location.back();
    }
}