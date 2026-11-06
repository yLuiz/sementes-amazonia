import { ApplicationConfig } from '@angular/core';
import { TitleStrategy, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { authInterceptor } from './services/auth/auth.interceptor';
import { httpCacheInterceptor } from './services/cache/http-cache.interceptor';
import { SeoTitleStrategy } from './shared/seo/seo-title.strategy';
import { provideMediaImages } from './shared/utils/media-image-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    // Carrega as animações sob demanda, fora do bundle inicial.
    provideAnimationsAsync(),
    provideToastr(), // Toastr providers
    provideHttpClient(withFetch(), withInterceptors([httpCacheInterceptor, authInterceptor])),
    provideMediaImages(),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
  ]
};
