import { Component } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-home-header',
    standalone: true,
    imports: [LucideAngularModule],
    templateUrl: './header.component.html'
})
export class HeaderComponent {
    isModalOpen = false;

    openDetailsModal() {
        this.isModalOpen = true;
    }

    closeDetailsModal() {
        this.isModalOpen = false;
    }
}