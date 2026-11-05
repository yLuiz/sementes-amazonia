import { Directive, ElementRef, Input, OnDestroy, OnInit, inject } from '@angular/core';

/** Faz o elemento aparecer com um leve deslize quando entra na tela. */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Atraso em ms, usado para escalonar cards de uma mesma grade. */
  @Input() revealDelay = 0;

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const canAnimate =
      typeof IntersectionObserver !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canAnimate) return;

    this.element.classList.add('reveal');
    this.element.style.transitionDelay = `${this.revealDelay}ms`;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        this.element.classList.add('is-visible');
        this.observer?.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    this.observer.observe(this.element);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
