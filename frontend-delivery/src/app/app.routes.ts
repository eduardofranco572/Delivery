import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { Home } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { adminGuard } from './core/guards/admin.guard';

import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrdersComponent } from './features/orders/orders.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [guestGuard]
    },
    {
        path: 'home',
        component: Home,
        canActivate: [authGuard]
    },
    {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [authGuard]
    },
    { 
        path: 'profile', 
        component: ProfileComponent, 
        canActivate: [authGuard] 
    },
    {
        path: 'admin',
        loadComponent: () => import('./features/admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
        canActivate: [adminGuard],
        children: [
            { 
                path: 'dashboard', 
                loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.DashboardComponent) 
            },
            { 
                path: 'perfil', 
                loadComponent: () => import('./features/admin/profile/admin-profile.component').then(m => m.AdminProfileComponent) 
            },
            { 
                path: 'products',
                loadComponent: () => import('./features/admin/products/admin-products.component').then(m => m.AdminProductsComponent) 
            },
            { 
                path: 'products/:id',
                loadComponent: () => import('./features/admin/products/components/admin-product-details.component').then(m => m.AdminProductDetailsComponent) 
            },
            { 
            path: 'preferences', 
                loadComponent: () => import('./features/admin/preferences/admin-preferences.component').then(m => m.AdminPreferencesComponent) 
            },
            { 
                path: 'preferences/:id', 
                loadComponent: () => import('./features/admin/preferences/components/admin-preference-details.component').then(m => m.AdminPreferenceDetailsComponent) 
            },
            { 
                path: 'groups', 
                loadComponent: () => import('./features/admin/groups/admin-groups.component').then(m => m.AdminGroupsComponent) 
            },
            { 
                path: 'groups/:id', 
                loadComponent: () => import('./features/admin/groups/components/admin-group-details.component').then(m => m.AdminGroupDetailsComponent) 
            },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    {
        path: '404',
        component: NotFoundComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/404'
    },

];