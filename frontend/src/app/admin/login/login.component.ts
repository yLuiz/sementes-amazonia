import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { FormFieldComponent } from '../../shared/ui/form-field.component';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, FormFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly form = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = false;
  errorMessage = '';
  inputType: 'password' | 'text' = 'password';

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    const { username, password } = this.form.getRawValue();
    this.authService.login({ username: username!, password: password! }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/news']);
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
        this.errorMessage =
          error.status === 401 ? 'Usuário ou senha incorretos.' : 'Não foi possível entrar. Tente novamente.';
      },
    });
  }

  changePasswordInput(): void {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }
}
