import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { apiConfig } from "../../config/api.config";

export interface ILoginRequest {
    username: string,
    password: string
}

export interface ILoginResponse {
    access_token: string,
    user: {
        id: number,
        username: string
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);

    private readonly apiUrl = apiConfig.auth.base;

    login(args: ILoginRequest): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, args);
    }

    authInApplication(payload: ILoginResponse) {
        localStorage.setItem('token', payload.access_token);

    }

    getToken() {
        return localStorage.getItem('token');

    }

    logout() {
        localStorage.removeItem('token');
    }

    validateToken(token: string) {
        if (!token) return false;

        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp) {
                const now = Math.floor(Date.now() / 1000);
                if (payload.exp < now) {
                    return false;
                }
            }

            return true;
        } catch (e) {
            return false;
        }
    }
}