import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, EMPTY, throwError } from 'rxjs';
import { apiConfig } from '../../config/api.config';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const SESSION_EXPIRED_MESSAGE = 'Sua sessão expirou. Entre novamente.';

// Nestas rotas o 401 é uma resposta esperada, tratada por quem chamou.
const OWN_401_HANDLING = [`${apiConfig.auth.base}/login`, `${apiConfig.auth.base}/me`];

/** Identifica as escritas da aplicação e leva ao login quando a sessão acaba. */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith('/api/')) {
    return next(req);
  }

  const router = inject(Router);
  const toastr = inject(ToastrService);
  const request = SAFE_METHODS.has(req.method)
    ? req
    : req.clone({ setHeaders: { 'X-Requested-With': 'sementes-web' } });

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || OWN_401_HANDLING.includes(req.url)) {
        return throwError(() => error);
      }

      // Encerra sem erro: a tela está de saída e não deve somar outro aviso a este.
      if (!toastr.findDuplicate('', SESSION_EXPIRED_MESSAGE, false, false)) {
        toastr.warning(SESSION_EXPIRED_MESSAGE);
      }
      router.navigate(['/admin/login']);
      return EMPTY;
    }),
  );
};
