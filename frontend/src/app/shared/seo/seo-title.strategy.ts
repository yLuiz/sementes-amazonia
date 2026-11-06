import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SeoPage, SeoService } from './seo.service';

/**
 * Aplica o título e as tags de cada rota. Rotas com `seoManaged` definem as tags no
 * próprio componente, porque elas dependem do conteúdo ou dos parâmetros da URL.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    let route = snapshot.root;
    while (route.firstChild) route = route.firstChild;
    if (route.data['seoManaged']) return;

    const page: SeoPage = route.data['seo'] ?? {};
    this.seo.update({ ...page, title: this.buildTitle(snapshot) });
  }
}
