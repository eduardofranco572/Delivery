import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [RouterModule, LucideAngularModule],
    templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
    isMobileMenuOpen = false;

    toggleMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
}