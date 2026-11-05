import { parseTags } from './parse-tags';

describe('parseTags', () => {
  it('aceita valor nulo, que antes derrubava o carrossel do hero', () => {
    expect(parseTags(null)).toEqual([]);
    expect(parseTags(undefined)).toEqual([]);
    expect(parseTags('')).toEqual([]);
  });

  it('separa, limpa e capitaliza', () => {
    expect(parseTags('floresta, IMPACTO,,comunidade ')).toEqual(['Floresta', 'Impacto', 'Comunidade']);
  });
});
