function parse(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Ex.: 04/11/2026. Data ausente ou inválida devolve texto vazio. */
export function formatShortDate(value?: string | null): string {
  return parse(value)?.toLocaleDateString('pt-BR') ?? '';
}

/** Ex.: 4 de novembro de 2026. Data ausente ou inválida devolve texto vazio. */
export function formatLongDate(value?: string | null): string {
  return parse(value)?.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) ?? '';
}
