import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

/** Indica a troca de rota com a barra no topo e a logo pulsando no centro. */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (loading$ | async) {
      <div class="top-progress" role="progressbar" aria-label="Carregando página"></div>
      <div class="loading-logo" aria-hidden="true">
        <img src="assets/logo.svg" alt="" width="96" height="96" />
      </div>
    }
  `,
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  readonly loading$ = inject(LoadingService).loading$;
}
