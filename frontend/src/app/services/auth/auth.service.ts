import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { apiConfig } from "../../config/api.config";
import { Observable } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

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
    private platformId = inject(PLATFORM_ID);

    private readonly apiUrl = apiConfig.auth.base;

    login(args: ILoginRequest): Observable<ILoginResponse> {
        return this.http.post<ILoginResponse>(`${this.apiUrl}/login`, args);
    }

    authInApplication(payload: ILoginResponse) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('token', payload.access_token);
        }
    }

    getToken() {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem('token');
        }
        return null;
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('token');
        }
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