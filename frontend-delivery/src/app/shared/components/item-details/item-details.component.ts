import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

import { Product, PreferenceGroup, Preference } from '../../../core/models/domain.models';
import { CartPayload } from '../../../features/cart/models/cart.models';

@Component({
    selector: 'app-item-details',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, FormsModule],
    templateUrl: './item-details.component.html'
})
export class ItemDetailsComponent {
    product: Product;
    preferenceGroups: PreferenceGroup[] = [];
    selectedPreferences: Set<number> = new Set();
    
    quantity = 1;
    observations = '';

    constructor(
        public dialogRef: DialogRef<CartPayload>,
        @Inject(DIALOG_DATA) public data: Product
    ) {
        this.product = data;
        this.preferenceGroups = data.preferenceGroups || [];
    }

    closeModal() {
        this.dialogRef.close();
    }

    togglePreference(pref: Preference) {
        if (this.selectedPreferences.has(pref.id)) {
            this.selectedPreferences.delete(pref.id);

        } else {
            this.selectedPreferences.add(pref.id);
        }
    }

    isSelected(pref: Preference) {
        return this.selectedPreferences.has(pref.id);
    }

    increaseQty() { 
        this.quantity++; 
    }

    decreaseQty() { 
        if (this.quantity > 1) this.quantity--; 
    }

    calculateTotal(): number {
        if (!this.product) return 0;
        
        const basePrice = (this.product.prodPromotionalPrice && this.product.prodPromotionalPrice < this.product.prodOriginalPrice) 
                            ? this.product.prodPromotionalPrice : this.product.prodOriginalPrice;
        
        let prefsPrice = 0;
        this.preferenceGroups.forEach(group => {
            group.preferences.forEach((p: Preference) => {
                if (this.selectedPreferences.has(p.id)) prefsPrice += (p.prefPrice || 0);
            });
        });
        
        return (basePrice + prefsPrice) * this.quantity;
    }

    confirm() {
        this.dialogRef.close({
            productId: this.product.id,
            quantity: this.quantity,
            observation: this.observations,
            preferenceIds: Array.from(this.selectedPreferences) 
        });
    }
}