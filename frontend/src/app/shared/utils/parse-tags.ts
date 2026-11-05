import { capitalize } from './capitalize';

/** Transforma "floresta, impacto" em ["Floresta", "Impacto"]. Aceita valor nulo. */
export function parseTags(tags?: string | null): string[] {
  return (tags ?? '')
    .split(',')
    .map((tag) => capitalize(tag.trim()))
    .filter(Boolean);
}
