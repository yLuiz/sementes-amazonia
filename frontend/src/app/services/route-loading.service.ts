import { Injectable } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { LoadingService } from '../services/loading.service';

/** A barra só aparece se a rota demorar mais do que isso, para não piscar. */
const SHOW_AFTER_MS = 150;

@Injectable({
  providedIn: 'root',
})
export class RouteLoadingService {
  private showTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clearTimer();
        this.showTimer = setTimeout(() => this.loadingService.show(), SHOW_AFTER_MS);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.clearTimer();
        this.loadingService.hide();
      }
    });
  }

  private clearTimer(): void {
    if (this.showTimer) clearTimeout(this.showTimer);
    this.showTimer = null;
  }
}
