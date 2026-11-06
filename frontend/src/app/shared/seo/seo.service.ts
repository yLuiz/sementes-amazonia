import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { apiConfig } from '../../config/api.config';
import { SITE_CONTENT } from '../content/site-content';
import { mediaUrl } from '../utils/media-url';

export const SITE_NAME = 'Sementes da Amazônia';
// Fixo de propósito: o endereço da Vercel e as prévias de deploy apontam para o domínio oficial.
export const SITE_URL = 'https://sementes-amazonia.org';

const DEFAULT_IMAGE = `${SITE_URL}/assets/og-image.jpg`;
const DESCRIPTION_MAX_LENGTH = 160;
const SHARE_IMAGE_WIDTH = 1280;

export interface SeoPage {
  title?: string;
  description?: string;
  /** Caminho canônico. Sem ele, a página não deve ser indexada. */
  path?: string;
  /** Imagem como vem da API. Sem ela, vale a imagem padrão do site. */
  image?: string | null;
  type?: 'website' | 'article';
}

/** Mantém as tags de busca e compartilhamento alinhadas com a página aberta. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);

  update(page: SeoPage): void {
    const title = page.title ?? SITE_NAME;
    const description = clipDescription(page.description ?? SITE_CONTENT.about);
    const image = shareImageUrl(page.image);

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:type', content: page.type ?? 'website' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    if (page.path) {
      const url = `${SITE_URL}${page.path}`;
      this.meta.removeTag("name='robots'");
      this.meta.updateTag({ property: 'og:url', content: url });
      this.canonicalLink().href = url;
    } else {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.meta.removeTag("property='og:url'");
      this.document.head.querySelector('link[rel="canonical"]')?.remove();
    }
  }

  private canonicalLink(): HTMLLinkElement {
    const existing = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (existing) return existing;

    const link = this.document.createElement('link');
    link.rel = 'canonical';
    this.document.head.appendChild(link);
    return link;
  }
}

/** Resume o texto sem cortar palavras, no tamanho que os buscadores costumam exibir. */
export function clipDescription(text: string): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= DESCRIPTION_MAX_LENGTH) return clean;

  const clipped = clean.slice(0, DESCRIPTION_MAX_LENGTH - 1);
  const lastSpace = clipped.lastIndexOf(' ');
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(/[\s.,;:!?-]+$/, '')}…`;
}

/** Quem lê estas tags precisa de um endereço completo; de arquivos enviados, usa a versão otimizada. */
export function shareImageUrl(image?: string | null): string {
  const url = mediaUrl(image);
  if (!url) return DEFAULT_IMAGE;

  const absolute = new URL(url, `${SITE_URL}/`).href;
  return url.startsWith(`${apiConfig.media.base}/`) ? `${absolute}?w=${SHARE_IMAGE_WIDTH}` : absolute;
}
