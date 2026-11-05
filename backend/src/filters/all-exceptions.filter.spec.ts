import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  PayloadTooLargeException,
} from '@nestjs/common';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { MulterError } from 'multer';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  AllExceptionsFilter,
  GENERIC_ERROR_MESSAGE,
} from './all-exceptions.filter';

function setup(request: Record<string, unknown> = {}, headersSent = false) {
  const response: any = { headersSent };
  response.status = jest.fn(() => response);
  response.json = jest.fn(() => response);
  response.end = jest.fn(() => response);

  const host = {
    switchToHttp: () => ({
      getRequest: () => ({
        method: 'POST',
        originalUrl: '/api/v1/news/7?token=abc',
        ...request,
      }),
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;

  return { host, response, body: () => response.json.mock.calls[0][0] };
}

describe('AllExceptionsFilter', () => {
  const filter = new AllExceptionsFilter();
  let logError: jest.SpyInstance;

  beforeEach(() => {
    logError = jest.spyOn(Logger.prototype, 'error').mockImplementation();
  });

  afterEach(() => jest.restoreAllMocks());

  it('segue o contrato de erros, com path sem query string', async () => {
    const { host, response, body } = setup();

    await filter.catch(new NotFoundException('Notícia não encontrada'), host);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(body()).toEqual({
      statusCode: 404,
      message: 'Notícia não encontrada',
      error: 'Not Found',
      path: '/api/v1/news/7',
      timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
    });
    expect(logError).not.toHaveBeenCalled();
  });

  it('mantém a lista de mensagens da validação', async () => {
    const { host, body } = setup();

    await filter.catch(
      new BadRequestException(['title should not be empty', 'x']),
      host,
    );

    expect(body().statusCode).toBe(400);
    expect(body().message).toEqual(['title should not be empty', 'x']);
  });

  it('aceita HttpException com corpo em texto', async () => {
    const { host, body } = setup();

    await filter.catch(new HttpException('Muitas tentativas', 429), host);

    expect(body()).toMatchObject({
      statusCode: 429,
      message: 'Muitas tentativas',
      error: 'Too Many Requests',
    });
  });

  it('erro inesperado responde 500 genérico e o detalhe vai só para o log', async () => {
    const { host, response, body } = setup();
    const secret = 'relation "news" does not exist at 10.0.0.1';

    await filter.catch(new Error(secret), host);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(body().message).toBe(GENERIC_ERROR_MESSAGE);
    expect(JSON.stringify(body())).not.toContain('10.0.0.1');
    expect(logError.mock.calls[0][1]).toContain(secret);
  });

  it('HttpException 5xx também não expõe a mensagem original', async () => {
    const { host, response, body } = setup();

    await filter.catch(
      new InternalServerErrorException('senha do banco incorreta', 'detalhe'),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(500);
    expect(body().message).toBe(GENERIC_ERROR_MESSAGE);
    expect(body().error).toBe('Internal Server Error');
    expect(JSON.stringify(body())).not.toContain('senha');
  });

  it('valor que não é Error responde 500 sem ir para o corpo', async () => {
    const { host, body } = setup();

    await filter.catch({ password: 'segredo' }, host);

    expect(body().statusCode).toBe(500);
    expect(JSON.stringify(body())).not.toContain('segredo');
    expect(JSON.stringify(logError.mock.calls)).not.toContain('segredo');
  });

  it('não registra corpo da requisição no log', async () => {
    const { host } = setup({ body: { password: 'segredo' } });

    await filter.catch(new Error('falha'), host);

    expect(JSON.stringify(logError.mock.calls)).not.toContain('segredo');
  });

  it('erro de limite convertido pelo FileInterceptor responde 413 em português', async () => {
    const { host, response, body } = setup();

    await filter.catch(new PayloadTooLargeException('File too large'), host);

    expect(response.status).toHaveBeenCalledWith(413);
    expect(body().message).toBe('Arquivo acima do limite de 5 MB.');
  });

  it('MulterError cru de tamanho responde 413', async () => {
    const { host, response } = setup();

    await filter.catch(new MulterError('LIMIT_FILE_SIZE'), host);

    expect(response.status).toHaveBeenCalledWith(413);
  });

  it('outro MulterError cru responde 400', async () => {
    const { host, response } = setup();

    await filter.catch(new MulterError('LIMIT_UNEXPECTED_FILE', 'foto'), host);

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it('erro 4xx de http-errors, como o do body-parser, mantém o status', async () => {
    const { host, response } = setup();
    const tooLarge = Object.assign(new Error('request entity too large'), {
      statusCode: 413,
      expose: true,
    });

    await filter.catch(tooLarge, host);

    expect(response.status).toHaveBeenCalledWith(413);
  });

  it('statusCode sem `expose` não é tratado como erro do cliente', async () => {
    const { host, response } = setup();

    await filter.catch(
      Object.assign(new Error('interno'), { statusCode: 404 }),
      host,
    );

    expect(response.status).toHaveBeenCalledWith(500);
  });

  describe('arquivo enviado', () => {
    let dir: string;

    beforeEach(() => {
      dir = mkdtempSync(join(tmpdir(), 'filter-spec-'));
    });

    afterEach(() => rmSync(dir, { recursive: true, force: true }));

    it('é removido antes de responder', async () => {
      const path = join(dir, 'upload.png');
      writeFileSync(path, 'x');
      const { host, response } = setup({
        file: { path, filename: 'upload.png' },
      });
      response.json.mockImplementation(() => {
        expect(existsSync(path)).toBe(false);
        return response;
      });

      await filter.catch(new BadRequestException('inválido'), host);

      expect(response.json).toHaveBeenCalled();
    });

    it('que já não existe não atrapalha a resposta', async () => {
      const { host, response } = setup({
        file: { path: join(dir, 'nao-existe.png'), filename: 'nao-existe.png' },
      });

      await filter.catch(new BadRequestException('inválido'), host);

      expect(response.status).toHaveBeenCalledWith(400);
    });
  });

  it('com a resposta já iniciada, só encerra', async () => {
    const { host, response } = setup({}, true);

    await filter.catch(new Error('falha no meio do envio'), host);

    expect(response.json).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });
});
