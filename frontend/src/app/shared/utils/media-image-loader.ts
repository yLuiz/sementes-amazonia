import { IMAGE_CONFIG, IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { Provider } from '@angular/core';
import { apiConfig } from '../../config/api.config';

/** Únicas larguras aceitas por `GET /media/:arquivo?w=`; qualquer outra responde 400. */
export const MEDIA_WIDTHS = [320, 640, 960, 1280, 1920];

/** Menor largura aceita que cobre o pedido, para a imagem nunca sair menor que o espaço dela. */
function toMediaWidth(width: number): number {
  return MEDIA_WIDTHS.find((allowed) => allowed >= width) ?? MEDIA_WIDTHS[MEDIA_WIDTHS.length - 1];
}

/** Só imagens do nosso upload têm variantes; o restante segue exatamente como veio. */
function isUploadedImage(src: string): boolean {
  const prefix = `${apiConfig.media.base}/`;
  return src.startsWith(prefix) && !/[/?#]/.test(src.slice(prefix.length));
}

export function mediaImageLoader({ src, width }: ImageLoaderConfig): string {
  if (!width || !isUploadedImage(src)) return src;
  return `${src}?w=${toMediaWidth(width)}`;
}

/**
 * O carregador vale para todo `ngSrc` do site, inclusive os sem `ngSrcset`, para os quais
 * o Angular monta o srcset sozinho. Por isso os pontos de quebra também seguem a lista.
 */
export function provideMediaImages(): Provider[] {
  return [
    { provide: IMAGE_LOADER, useValue: mediaImageLoader },
    { provide: IMAGE_CONFIG, useValue: { breakpoints: [...MEDIA_WIDTHS] } },
  ];
}
