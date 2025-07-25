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
import { AuthService } from '../../services/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [MatIconModule, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this._authService.login({
        username: this.username,
        password: this.password,
      })
        .subscribe({
          next: (res) => {
            this._authService.authInApplication(res);
            this._router.navigate(['/admin/registers']);
          },
          error: (err) => {
            console.error(err)
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
