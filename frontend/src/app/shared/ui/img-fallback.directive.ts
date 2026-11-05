import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';

const WATERMARK = 'assets/logo.svg';

/**
 * Troca uma imagem que falhou. Sem valor, mostra o logo em marca d'água no lugar
 * do ícone quebrado; com valor, usa a foto indicada. Só tenta uma vez, para não
 * entrar em laço caso o próprio fallback falhe.
 */
@Directive({
  selector: 'img[appImgFallback]',
  standalone: true,
})
export class ImgFallbackDirective {
  @Input() appImgFallback = '';

  private readonly element = inject<ElementRef<HTMLImageElement>>(ElementRef).nativeElement;
  private failed = false;

  @HostListener('error')
  onError(): void {
    if (this.failed) return;
    this.failed = true;

    this.element.removeAttribute('srcset');
    this.element.src = this.appImgFallback || WATERMARK;
    if (!this.appImgFallback) {
      this.element.classList.add('is-fallback');
    }
  }
}
