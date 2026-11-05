import { apiConfig } from '../../config/api.config';

/**
 * Monta a URL de uma imagem. Só prefixa com a API o que veio do upload: endereços
 * completos e arquivos locais seguem como estão, e valor vazio devolve `null` para
 * que nenhuma requisição inútil seja feita.
 */
export function mediaUrl(path?: string | null): string | null {
  if (!path) return null;
  if (/^(https?:|data:|blob:|\/\/)/.test(path) || path.startsWith('assets/')) return path;
  return `${apiConfig.media.base}/${path}`;
}
