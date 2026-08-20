import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

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
    Pencil
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(
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
          Pencil
      })
    )
  ]
};