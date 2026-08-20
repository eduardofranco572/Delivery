import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-payment-selector',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule],
    templateUrl: './payment-selector.component.html'
})
export class PaymentSelectorComponent {
    @Input() paymentMethod: 'pix' | 'card' | 'cash' = 'pix';
    @Output() paymentMethodChange = new EventEmitter<'pix' | 'card' | 'cash'>();

    @Input() changeFor: string = '';
    @Output() changeForChange = new EventEmitter<string>();

    onMethodChange(method: 'pix' | 'card' | 'cash'){
        this.paymentMethod = method;
        this.paymentMethodChange.emit(this.paymentMethod);
    }

    onChangeFor(value: string){
        this.changeFor = value;
        this.changeForChange.emit(this.changeFor);
    }

}