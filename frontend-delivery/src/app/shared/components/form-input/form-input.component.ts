import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular'; 

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [LucideAngularModule], 
  templateUrl: './form-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ]
})
export class FormInputComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() type: string = 'text';
    @Input() placeholder: string = '';
    @Input() hasIcon: boolean = true;
    @Input() step?: string;
    @Input() maxlength?: string;
    @Input() customClass: string = '';
    @Input() bgColor: string = 'bg-card';

    value: string = '';
    isDisabled: boolean = false;
    showPassword: boolean = false;

    onChange: (value: string) => void = () => {};
    onTouched: () => void = () => {};

    writeValue(value: string | null): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    onInput(event: Event): void {
        const inputValue = (event.target as HTMLInputElement).value;
        this.value = inputValue;
        this.onChange(this.value);
    }

    togglePassword(): void {
        this.showPassword = !this.showPassword;
    }

    get inputType(): string {
        if (this.type === 'password') {
            return this.showPassword ? 'text' : 'password';
        }
        return this.type;
    }
}