import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Address } from '../../../../core/models/global.models';

@Component({
    selector: 'app-address-modal',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './address-modal.component.html'
})
export class AddressModalComponent {
    @Input() addresses: Address[] = [];
    @Input() userAddress: Address | null = null;

    @Output() close = new EventEmitter<void>();
    @Output() selectAddress = new EventEmitter<any>();

    onClose() {
        this.close.emit();
    }

    onSelect(address: any) {
        this.selectAddress.emit(address);
    }
}