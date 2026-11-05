import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { UPLOAD_DIR } from '../../config/multer.config';
import { MediaController } from './media.controller';

describe('MediaController', () => {
  const controller = new MediaController();
  const filename = `media-controller-spec-${process.pid}.txt`;
  const path = join(UPLOAD_DIR, filename);

  /** Resposta falsa em que o envio do arquivo falha, antes ou depois dos cabeçalhos. */
  const failingResponse = (headersSent: boolean) => {
    const headers = new Map<string, string>();
    const res = {
      headersSent,
      destroy: jest.fn(),
      setHeader: (key: string, value: string) => headers.set(key, value),
      removeHeader: (key: string) => headers.delete(key),
      sendFile: (_name: string, _options: object, done: (e: Error) => void) =>
        done(new Error('falha de leitura')),
    };
    return { res: res as unknown as Response, headers, destroy: res.destroy };
  };

  beforeAll(() => writeFile(path, 'x'));
  afterAll(() => rm(path, { force: true }));

  it('falha no envio vira 404, sem herdar cabeçalhos da imagem', async () => {
    const { res, headers } = failingResponse(false);
    await expect(
      controller.getFile(filename, undefined, res),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(headers.has('Content-Type')).toBe(false);
    expect(headers.has('Cache-Control')).toBe(false);
  });

  it('falha no meio do envio encerra a conexão', async () => {
    const { res, destroy } = failingResponse(true);
    await controller.getFile(filename, undefined, res);
    expect(destroy).toHaveBeenCalled();
  });

  it('largura inválida responde 400 antes de olhar o arquivo', async () => {
    const { res } = failingResponse(false);
    await expect(
      controller.getFile('inexistente.png', '100', res),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
