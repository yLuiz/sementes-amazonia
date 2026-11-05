import { DOCUMENT } from '@angular/common';
import { Injectable, NgZone, inject } from '@angular/core';
import { Observable, distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private readonly zone = inject(NgZone);
  private readonly document = inject(DOCUMENT);

  /**
   * Avisa quando a rolagem cruza `offset`. Ouve fora da zona do Angular e só
   * volta a ela quando o estado muda, para não redesenhar a página a cada pixel.
   */
  pastOffset(offset: number): Observable<boolean> {
    return new Observable((subscriber) => {
      const window = this.document.defaultView!;
      return this.zone.runOutsideAngular(() =>
        fromEvent(window, 'scroll', { passive: true })
          .pipe(
            startWith(null),
            map(() => window.scrollY > offset),
            distinctUntilChanged(),
          )
          .subscribe((past) => this.zone.run(() => subscriber.next(past))),
      );
    });
  }
}
