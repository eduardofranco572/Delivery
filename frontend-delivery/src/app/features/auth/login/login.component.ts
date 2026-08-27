import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { LucideAngularModule } from 'lucide-angular';
import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        AuthLayoutComponent, 
        RouterModule,
        ReactiveFormsModule,
        FormInputComponent,
        LucideAngularModule
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private alertService: AlertService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmitForm() {
        if (this.loginForm.invalid) {
            this.alertService.warning(
                'Atenção', 
                'Verifique se todos os campos estão preenchidos'
            );
            return;
        }

        const credentials = this.loginForm.value;

        this.authService.login(credentials).subscribe({
            next: (response) => {
                this.alertService.success(
                    'Bem-vindo!',
                    'Login realizado com sucesso.',
                    () => this.router.navigate(['/home'])
                );
            },
            error: (error) => {
                this.alertService.error(
                    'Erro...',
                    error.error?.error || 'Não foi possível fazer login.'
                );
            }
        });
    }
}