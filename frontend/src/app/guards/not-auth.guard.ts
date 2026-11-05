import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const notAuthGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(AuthService)
    .hasSession()
    .pipe(map((hasSession) => !hasSession || router.createUrlTree(['/admin/news'])));
};
