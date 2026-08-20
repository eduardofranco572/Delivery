import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { RouterModule } from '@angular/router';
import { FormInputComponent } from '../../../shared/components/form-input/form-input.component';
import { LucideAngularModule } from 'lucide-angular';
import { AlertService } from '../../../core/services/alert.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        AuthLayoutComponent, 
        ReactiveFormsModule, 
        RouterModule,
        FormInputComponent,
        LucideAngularModule 
    ],
    templateUrl: './signup.component.html'
})

export class SignupComponent {
    signupForm: FormGroup;

    showPassword = false;

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    constructor(
        private authService: AuthService,
        private router: Router,
        private fb: FormBuilder,
        private alertService: AlertService
    ) {
        this.signupForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmitForm() {
        if (this.signupForm.invalid) {
            this.alertService.warning(
                'Atenção', 
                'Verifique se todos os campos estão preenchidos e a senha tem pelo menos 6 caracteres.'
            );
            return;
        }

        const realUserData = this.signupForm.value;

        this.authService.signup(realUserData).subscribe({
           next: (response) => {
                this.alertService.success(
                    'Conta criada!', 
                    'Seu cadastro foi realizado com sucesso.', 
                    () => this.router.navigate(['/login'])
                );
            },
            error: (error) => {
                this.alertService.error(
                    'Ops...', 
                    error.error?.error || 'Não foi possível criar sua conta.'
                );
            }
        });
    }

}