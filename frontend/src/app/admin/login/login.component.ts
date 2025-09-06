import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _toastr: ToastrService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid && !this.isLoading) {
      this.isLoading = true;
      
      this._authService.login({
        username: this.username,
        password: this.password,
      })
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this._authService.authInApplication(res);
            this._router.navigate(['/admin/registers']);
          },
          error: (err) => {
            this.isLoading = false;
            console.error(err)
            if (err.status === 401) {

              this._toastr.error('Credências inválidas', 'Não autorizado.', {
                closeButton: true,
                tapToDismiss: true,
                progressBar: true
              });

              return;
            }

            this._toastr.error('Houve um erro ao fazer login.', 'Falha de login.', {
              closeButton: true,
              tapToDismiss: true,
              progressBar: true
            });
          }
        });
    }
  }

  inputType = 'password';

  changePasswordInput() {
    if (this.inputType === 'password') {
      this.inputType = 'text';
    } else {
      this.inputType = 'password';
    }
  }

  get username() {
    return this.form.get('username')?.value || '';
  }

  get password() {
    return this.form.get('password')?.value || '';
  }
}
