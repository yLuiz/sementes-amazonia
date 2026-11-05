import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { PageHeaderComponent } from '../shared/page-header/page-header.component';

// Mesmos limites de `backend/src/auth/password-policy.ts`.
const MIN_LENGTH = 12;
const MAX_LENGTH = 72;

const passwordsMatch = (group: AbstractControl): ValidationErrors | null =>
  group.get('newPassword')?.value === group.get('confirmPassword')?.value ? null : { mismatch: true };

@Component({
  standalone: true,
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, ButtonDirective, FormFieldComponent, PageHeaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toastr = inject(ToastrService);

  readonly minLength = MIN_LENGTH;
  readonly maxLength = MAX_LENGTH;

  readonly form = inject(FormBuilder).group(
    {
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(MIN_LENGTH), Validators.maxLength(MAX_LENGTH)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatch },
  );

  isSaving = false;
  errorMessage = '';

  get newPasswordError(): string {
    const control = this.form.controls.newPassword;
    return control.touched && control.invalid && control.value ? `Use pelo menos ${MIN_LENGTH} caracteres.` : '';
  }

  get confirmPasswordError(): string {
    return this.form.controls.confirmPassword.touched && this.form.hasError('mismatch') ? 'As senhas não são iguais.' : '';
  }

  onSubmit(): void {
    if (this.isSaving) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const { oldPassword, newPassword } = this.form.getRawValue();
    this.authService.changePassword({ oldPassword: oldPassword!, newPassword: newPassword! }).subscribe({
      next: () => {
        this.isSaving = false;
        this.form.reset();
        this.toastr.success('Senha alterada com sucesso.');
      },
      error: (error) => {
        this.isSaving = false;
        const message = error.error?.message;
        this.errorMessage =
          error.status === 400 && typeof message === 'string' ? `${message}.` : 'Não foi possível alterar a senha. Tente novamente.';
      },
    });
  }
}
