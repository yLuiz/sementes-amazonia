const ALLOWED_TAGS = ['strong', 'em', 'b', 'i', 'u'];

/**
 * Divide o texto em parágrafos e mantém só as tags de ênfase. O resultado ainda
 * passa pelo sanitizador do Angular ao ser exibido com `innerHTML`.
 */
export function contentToParagraphs(content?: string | null): string[] {
  return (content ?? '')
    .split(/<br\s*\/?>|\r?\n/i)
    .map((paragraph) =>
      paragraph
        .replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (match, tag: string) =>
          ALLOWED_TAGS.includes(tag.toLowerCase()) ? match : '',
        )
        .trim(),
    )
    .filter(Boolean);
}
