import { contentToParagraphs } from './content-to-paragraphs';

describe('contentToParagraphs', () => {
  it('divide por <br> e quebra de linha, ignorando trechos vazios', () => {
    expect(contentToParagraphs('um<br>dois\n\ntrês<br/>')).toEqual(['um', 'dois', 'três']);
  });

  it('mantém ênfase e remove as demais tags', () => {
    expect(contentToParagraphs('<strong>a</strong> <script>b</script> <a href="x">c</a>')).toEqual([
      '<strong>a</strong> b c',
    ]);
  });

  it('aceita conteúdo vazio', () => {
    expect(contentToParagraphs(null)).toEqual([]);
  });
});
