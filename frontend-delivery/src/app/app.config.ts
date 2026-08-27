import { ApplicationConfig, importProvidersFrom, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { FlatpickrModule } from 'angularx-flatpickr';
import { environment } from '../environments/environment';

import {
    LucideAngularModule,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ShoppingBag,
    Flame,
    ClipboardList,
    Star,
    Info,
    MapPin,
    Clock,
    X,
    Search,
    Plus,
    Trash2,
    ArrowLeft,
    Wallet,
    QrCode,
    CreditCard,
    Banknote,
    CheckCircle,
    Pencil,
    LayoutDashboard,
    Layers,
    Calendar,
    Filter,
    DollarSign,
    Receipt,
    Users,
    TrendingUp,
    Menu,
    Image,
} from 'lucide-angular';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    provideApollo(() => {
        const httpLink = inject(HttpLink);
        const graphqlUri = environment.apiUrl.replace('/api', '/graphql');

        return {
            link: httpLink.create({ uri: graphqlUri }),
            cache: new InMemoryCache(),
        };
    }),

    importProvidersFrom(
        FlatpickrModule.forRoot(),
        LucideAngularModule.pick({
            User,
            Mail,
            Lock,
            Eye,
            EyeOff,
            ShoppingBag,
            Flame,
            ClipboardList,
            Star,
            Info,
            MapPin,
            Clock, X,
            Search,
            Plus,
            Trash2,
            ArrowLeft,
            Wallet,
            QrCode,
            CreditCard,
            Banknote,
            CheckCircle,
            Pencil,
            LayoutDashboard,
            Layers,
            Calendar,
            Filter,
            DollarSign,
            Receipt,
            Users,
            TrendingUp,
            Menu,
            Image,
      })
    )
  ]
};