import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './success-modal.component.html'
})
export class SuccessModalComponent{
    @Input() isVisible: boolean = false;
}