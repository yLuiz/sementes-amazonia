import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { apiConfig } from '../../config/api.config';

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  user: {
    id: number;
    username: string;
  };
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

/** A sessão vive em um cookie `HttpOnly`: o JavaScript não lê o token, só pergunta à API. */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = apiConfig.auth.base;

  login(args: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, args);
  }

  hasSession(): Observable<boolean> {
    return this.http.get(`${this.apiUrl}/me`).pipe(
      map(() => true),
      catchError(() => of(false)),
    );
  }

  logout(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  changePassword(args: IChangePasswordRequest): Observable<unknown> {
    return this.http.put(`${this.apiUrl}/change-password`, args);
  }
}
