import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timerProgressBar: true,
        background: '#2a2520',
        color: '#ffffff',
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });

    success(title: string, text: string, redirectAction?: () => void) {
        this.Toast.fire({
            icon: 'success',
            title: title,
            text: text,
            iconColor: 'var(--color-green)', 
            timer: redirectAction ? 1500 : 3000
        }).then(() => {
            if (redirectAction) redirectAction();
        });
    }

    error(title: string, text: string) {
        this.Toast.fire({
            icon: 'error',
            title: title,
            text: text,
            iconColor: 'var(--color-primary)',
            timer: 3000
        });
    }

    warning(title: string, text: string) {
        this.Toast.fire({
            icon: 'warning',
            title: title,
            text: text,
            iconColor: 'var(--color-primary)', 
            timer: 3000
        });
    }
}