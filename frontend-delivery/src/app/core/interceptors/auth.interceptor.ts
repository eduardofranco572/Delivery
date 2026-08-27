import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const isApiUrl = req.url.startsWith(environment.apiUrl);

    if (isApiUrl) {
        const clonedReq = req.clone({
            withCredentials: true
        });
        
        return next(clonedReq);
    }

    return next(req);
};