import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { unlink } from 'fs/promises';
import { STATUS_CODES } from 'http';

export const GENERIC_ERROR_MESSAGE = 'Erro interno do servidor';

// Textos fixos do multer e do body-parser, que chegam em inglês até o usuário.
const TRANSLATED_MESSAGES: Record<string, string> = {
  'File too large': 'Arquivo acima do limite de 5 MB.',
  'request entity too large': 'Corpo da requisição acima do limite permitido.',
};

interface NormalizedError {
  status: number;
  message: string | string[];
  error?: string;
}

function isMessage(value: unknown): value is string | string[] {
  return (
    typeof value === 'string' ||
    (Array.isArray(value) && value.every((item) => typeof item === 'string'))
  );
}

function fromHttpException(exception: HttpException): NormalizedError {
  const status = exception.getStatus();
  const body = exception.getResponse();

  if (typeof body === 'string') {
    return { status, message: body, error: STATUS_CODES[status] };
  }

  const { message, error } = body as { message?: unknown; error?: unknown };
  return {
    status,
    message: isMessage(message) ? message : exception.message,
    error: typeof error === 'string' ? error : STATUS_CODES[status],
  };
}

function normalize(exception: unknown): NormalizedError {
  if (exception instanceof HttpException) {
    return fromHttpException(exception);
  }

  const candidate = (exception ?? {}) as {
    name?: unknown;
    code?: unknown;
    message?: unknown;
    statusCode?: unknown;
    expose?: unknown;
  };
  const message = isMessage(candidate.message) ? candidate.message : '';

  // O FileInterceptor já converte o erro do multer, mas uso direto do multer chega cru até aqui.
  if (candidate.name === 'MulterError') {
    const status =
      candidate.code === 'LIMIT_FILE_SIZE'
        ? HttpStatus.PAYLOAD_TOO_LARGE
        : HttpStatus.BAD_REQUEST;
    return { status, message, error: STATUS_CODES[status] };
  }

  // Erros do body-parser e do envio de arquivos (pacote http-errors) marcam com `expose` o que pode ir ao cliente.
  const { statusCode } = candidate;
  if (
    typeof statusCode === 'number' &&
    statusCode >= 400 &&
    statusCode < 500 &&
    candidate.expose === true
  ) {
    return { status: statusCode, message, error: STATUS_CODES[statusCode] };
  }

  return {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: GENERIC_ERROR_MESSAGE,
  };
}

/**
 * Formato único de erro da API. Também é o único ponto por onde passa toda falha
 * depois do upload, por isso remove aqui o arquivo que a requisição deixaria órfão.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly _logger = new Logger('Exceptions');

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    const http = host.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    // Sem a query string: ela pode trazer dados que não devem ir para o log nem voltar na resposta.
    const path = (request.originalUrl ?? request.url ?? '').split('?')[0];
    const normalized = normalize(exception);
    const isServerError = normalized.status >= 500;

    if (isServerError) {
      const stack =
        exception instanceof Error
          ? exception.stack
          : `Exceção do tipo ${typeof exception}`;
      this._logger.error(
        `${request.method} ${path} - ${normalized.status}`,
        stack,
      );
    }

    await this._removeUploadedFile(request.file);

    if (response.headersSent) {
      response.end();
      return;
    }

    const message =
      typeof normalized.message === 'string'
        ? (TRANSLATED_MESSAGES[normalized.message] ?? normalized.message)
        : normalized.message;

    response.status(normalized.status).json({
      statusCode: normalized.status,
      message: isServerError ? GENERIC_ERROR_MESSAGE : message,
      error: isServerError ? STATUS_CODES[normalized.status] : normalized.error,
      path,
      timestamp: new Date().toISOString(),
    });
  }

  private async _removeUploadedFile(file?: Express.Multer.File): Promise<void> {
    if (!file?.path) return;

    try {
      await unlink(file.path);
    } catch (err: any) {
      if (err?.code !== 'ENOENT') {
        this._logger.warn(
          `Falha ao remover o upload "${file.filename}": ${err?.message ?? err}`,
        );
      }
    }
  }
}
