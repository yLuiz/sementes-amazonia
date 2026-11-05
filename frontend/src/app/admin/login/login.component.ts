import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { FormFieldComponent } from '../../shared/ui/form-field.component';
import { PasswordRevealComponent } from '../../shared/ui/password-reveal.component';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, FormFieldComponent, PasswordRevealComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  readonly form = inject(FormBuilder).group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  isLoading = false;
  errorMessage = '';

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
        this.isLoading = false;
        // O 429 chega com a mensagem da API, que diz quanto tempo esperar.
        this.errorMessage =
          error.status === 401 ? 'Usuário ou senha incorretos.' : apiErrorMessage(error, 'Não foi possível entrar. Tente novamente.');
        this.cdr.markForCheck();
      },
    });
  }
}
