import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

@Component({
  selector: 'app-address-list-modal',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './address-list-modal.component.html'
})
export class AddressListModalComponent {
    addresses: any[] = [];

    constructor(
        public dialogRef: DialogRef<any>,
        @Inject(DIALOG_DATA) public data: any
    ) {
        this.addresses = data.addresses || [];
    }

    close() {
        this.dialogRef.close();
    }

    editAddress(address: any) {
        this.dialogRef.close({ action: 'edit', address });
    }
}