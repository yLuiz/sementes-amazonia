import { HttpErrorResponse } from '@angular/common/http';
import {
  apiErrorMessage,
  FILE_TOO_LARGE_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  isNotFoundError,
  NETWORK_ERROR_MESSAGE,
  TOO_MANY_REQUESTS_MESSAGE,
} from './api-error';

const httpError = (status: number, error: unknown = null) => new HttpErrorResponse({ status, error });

describe('apiErrorMessage', () => {
  it('usa a mensagem em texto do contrato, terminando com ponto', () => {
    expect(apiErrorMessage(httpError(400, { statusCode: 400, message: 'Senha atual incorreta' }))).toBe('Senha atual incorreta.');
  });

  it('não repete a pontuação que a mensagem já tem', () => {
    expect(apiErrorMessage(httpError(400, { message: 'Tudo errado!' }))).toBe('Tudo errado!');
  });

  it('junta a mensagem em lista', () => {
    expect(apiErrorMessage(httpError(400, { message: ['Título obrigatório', 'Resumo obrigatório.'] }))).toBe(
      'Título obrigatório. Resumo obrigatório.',
    );
  });

  it('ignora itens que não são texto ou estão vazios', () => {
    expect(apiErrorMessage(httpError(400, { message: ['', 42, null, 'Válido'] }))).toBe('Válido.');
    expect(apiErrorMessage(httpError(400, { message: [] }), 'reserva')).toBe('reserva');
    expect(apiErrorMessage(httpError(400, { message: '   ' }), 'reserva')).toBe('reserva');
  });

  it('cai na mensagem de reserva sem corpo, com corpo em texto ou com outro formato', () => {
    expect(apiErrorMessage(httpError(400), 'reserva')).toBe('reserva');
    expect(apiErrorMessage(httpError(502, '<html>Bad Gateway</html>'), 'reserva')).toBe('reserva');
    expect(apiErrorMessage(httpError(404, '<html></html>'))).toBe(GENERIC_ERROR_MESSAGE);
  });

  it('nunca mostra o texto de um 5xx', () => {
    expect(apiErrorMessage(httpError(500, { message: 'Erro interno do servidor' }), 'Não foi possível salvar.')).toBe('Não foi possível salvar.');
    expect(apiErrorMessage(httpError(503, { message: 'relation "news" does not exist' }))).toBe(GENERIC_ERROR_MESSAGE);
  });

  it('trata 413, seja qual for o corpo', () => {
    expect(apiErrorMessage(httpError(413, { message: 'File too large' }))).toBe(FILE_TOO_LARGE_MESSAGE);
    expect(apiErrorMessage(httpError(413, 'Request Entity Too Large'))).toBe(FILE_TOO_LARGE_MESSAGE);
  });

  it('trata erro de rede', () => {
    expect(apiErrorMessage(httpError(0, new ProgressEvent('error')), 'reserva')).toBe(NETWORK_ERROR_MESSAGE);
  });

  it('no 429 prefere a mensagem da API e tem uma própria se ela faltar', () => {
    expect(apiErrorMessage(httpError(429, { message: 'Muitas tentativas. Aguarde 15 minutos.' }))).toBe('Muitas tentativas. Aguarde 15 minutos.');
    expect(apiErrorMessage(httpError(429))).toBe(TOO_MANY_REQUESTS_MESSAGE);
  });

  it('aceita o que não é erro HTTP', () => {
    expect(apiErrorMessage(new Error('boom'), 'reserva')).toBe('reserva');
    expect(apiErrorMessage(undefined)).toBe(GENERIC_ERROR_MESSAGE);
  });
});

describe('isNotFoundError', () => {
  it('reconhece 404 e o 400 de id inválido', () => {
    expect(isNotFoundError(httpError(404))).toBeTrue();
    expect(isNotFoundError(httpError(400))).toBeTrue();
  });

  it('não confunde falha da API com registro inexistente', () => {
    expect(isNotFoundError(httpError(500))).toBeFalse();
    expect(isNotFoundError(httpError(0))).toBeFalse();
    expect(isNotFoundError(new Error('boom'))).toBeFalse();
  });
});
