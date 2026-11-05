import { apiConfig } from '../../config/api.config';
import { mediaUrl } from './media-url';

describe('mediaUrl', () => {
  it('devolve null sem imagem, para não gerar requisição', () => {
    expect(mediaUrl(null)).toBeNull();
    expect(mediaUrl(undefined)).toBeNull();
    expect(mediaUrl('')).toBeNull();
  });

  it('prefixa com a API o arquivo vindo do upload', () => {
    expect(mediaUrl('abc.webp')).toBe(`${apiConfig.media.base}/abc.webp`);
  });

  it('mantém endereços completos e arquivos locais', () => {
    expect(mediaUrl('https://example.com/a.jpg')).toBe('https://example.com/a.jpg');
    expect(mediaUrl('assets/photos/hero-forest.webp')).toBe('assets/photos/hero-forest.webp');
    expect(mediaUrl('data:image/png;base64,AAAA')).toBe('data:image/png;base64,AAAA');
  });
});
