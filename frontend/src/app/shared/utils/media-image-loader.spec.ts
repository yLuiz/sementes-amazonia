import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { apiConfig } from '../../config/api.config';
import { ContentCardComponent } from '../ui/content-card.component';
import { MEDIA_WIDTHS, mediaImageLoader, provideMediaImages } from './media-image-loader';

describe('imagem do card com o carregador', () => {
  const render = (image_thumb: string | null) => {
    TestBed.configureTestingModule({
      imports: [ContentCardComponent],
      providers: [provideRouter([]), provideMediaImages()],
    });
    const fixture = TestBed.createComponent(ContentCardComponent);
    fixture.componentRef.setInput('type', 'news');
    fixture.componentRef.setInput('item', { id: 1, title: 'Título', summary: 'Resumo', image_thumb });
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('img') as HTMLImageElement;
  };

  it('imagem do upload recebe srcset com as larguras da API', () => {
    const base = `${apiConfig.media.base}/abc.webp`;
    const img = render('abc.webp');
    expect(img.getAttribute('src')).toBe(base);
    expect(img.getAttribute('srcset')).toBe(`${base}?w=320 320w, ${base}?w=640 640w, ${base}?w=960 960w`);
  });

  it('URL externa não recebe ?w= da API', () => {
    const url = 'https://example.com/a.jpg';
    const img = render(url);
    expect(img.getAttribute('src')).toBe(url);
    expect(img.getAttribute('srcset')).toBe(`${url} 320w, ${url} 640w, ${url} 960w`);
  });

  it('o fallback tira o srcset, para o navegador não voltar à imagem que falhou', () => {
    const img = render('abc.webp');
    img.dispatchEvent(new Event('error'));
    expect(img.hasAttribute('srcset')).toBeFalse();
    expect(img.getAttribute('src')).toBe('assets/logo.svg');
    expect(img.classList.contains('is-fallback')).toBeTrue();
  });
});

describe('mediaImageLoader', () => {
  const upload = `${apiConfig.media.base}/abc.webp`;

  it('acrescenta ?w= às imagens do upload', () => {
    expect(mediaImageLoader({ src: upload, width: 640 })).toBe(`${upload}?w=640`);
  });

  it('usa só larguras aceitas pela API, sem nunca reduzir o pedido', () => {
    expect(mediaImageLoader({ src: upload, width: 16 })).toBe(`${upload}?w=320`);
    expect(mediaImageLoader({ src: upload, width: 641 })).toBe(`${upload}?w=960`);
    expect(mediaImageLoader({ src: upload, width: 3840 })).toBe(`${upload}?w=1920`);
    for (const width of MEDIA_WIDTHS) {
      expect(mediaImageLoader({ src: upload, width })).toBe(`${upload}?w=${width}`);
    }
  });

  it('sem largura devolve o original', () => {
    expect(mediaImageLoader({ src: upload })).toBe(upload);
  });

  it('não altera URLs externas, mesmo com vírgula, query ou caminho parecido', () => {
    for (const src of [
      'https://images.unsplash.com/photo-1?auto=format,compress&w=1200',
      'https://example.com/a.jpg',
      '//cdn.example.com/a.jpg',
      `https://example.com${apiConfig.media.base}/abc.webp`,
    ]) {
      expect(mediaImageLoader({ src, width: 640 })).toBe(src);
    }
  });

  it('não altera arquivos locais nem dados embutidos', () => {
    for (const src of ['assets/logo.svg', 'assets/photos/community-planting.webp', 'data:image/png;base64,AAAA']) {
      expect(mediaImageLoader({ src, width: 640 })).toBe(src);
    }
  });

  it('não acrescenta um segundo parâmetro nem aceita subpastas', () => {
    for (const src of [`${upload}?w=320`, `${upload}#x`, `${apiConfig.media.base}/a/b.webp`]) {
      expect(mediaImageLoader({ src, width: 640 })).toBe(src);
    }
  });
});
