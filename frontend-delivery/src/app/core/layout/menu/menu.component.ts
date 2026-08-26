import { Component, EventEmitter, Output, OnInit, inject } from '@angular/core'; // <-- Importe o inject
import { toSignal } from '@angular/core/rxjs-interop';
import { LucideAngularModule } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { CartService } from '../../../features/cart/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [LucideAngularModule, RouterModule],
    templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {
    navButtonClass = 'flex flex-col md:flex-row items-center gap-1 md:gap-2 p-2 md:px-5 md:py-2.5 rounded-xl md:rounded-full border border-transparent md:border-gray text-subtext md:text-white md:hover:border-primary/60 transition-all duration-300 group w-full md:w-auto justify-center cursor-pointer';
    
    @Output() openCartModal = new EventEmitter<void>();

    private cartService = inject(CartService);
    private authService = inject(AuthService);

    cartCount = toSignal(this.cartService.cartCount$, { initialValue: 0 });

    ngOnInit() {
        const userId = this.authService.getUserId();
        if (userId) {
            this.cartService.updateCartCount(userId);
        }
    }

    onOpenCart() {
        this.openCartModal.emit();
    }
}