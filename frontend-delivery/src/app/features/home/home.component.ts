import { Component } from '@angular/core';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { HeaderComponent } from './components/header/header.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { CartComponent } from '../cart/cart.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MenuComponent, HeaderComponent, ProductListComponent, DialogModule],
    templateUrl: './home.component.html'
})
export class Home {
    constructor(private dialog: Dialog) {}

    openCart() {
        this.dialog.open(CartComponent, {
            hasBackdrop: true,
            backdropClass: ['bg-black/70', 'backdrop-blur-sm'],
            panelClass: ['w-full', 'md:w-[28rem]', 'lg:w-[35%]', 'h-full', '!fixed', '!right-0', '!inset-y-0', 'animate-slide-in-right']
        });
    }
}