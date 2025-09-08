import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { Observable, isObservable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Readable } from 'stream';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  // limites para não poluir os logs
  private readonly MAX_LOG_CHARS = 10_000; // ~10KB

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() !== 'http') {
      // Só loga HTTP
      return next.handle();
    }

    const httpCtx = context.switchToHttp();
    const request = httpCtx.getRequest();
    const response = httpCtx.getResponse();

    const { method, url, headers, body, query, params } = request;

    const userAgent: string = headers['user-agent'] || '';
    const clientIP =
      headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.ip ||
      request.socket?.remoteAddress;

    const startTime = Date.now();

    // Body logável?
    const isSensitive = this.isSensitiveRoute(url) || this.isMultipart(headers);
    const safeBody = isSensitive ? '[SENSITIVE DATA HIDDEN]' : this.safeJson(body);

    this.logger.log(
      [
        `[REQUEST] ${method} ${url}`,
        `IP: ${clientIP}`,
        `User-Agent: ${userAgent.substring(0, 100)}${userAgent.length > 100 ? '...' : ''}`,
        query && Object.keys(query).length ? `Query: ${this.safeJson(query)}` : '',
        params && Object.keys(params).length ? `Params: ${this.safeJson(params)}` : '',
        safeBody && safeBody !== '{}' ? `Body: ${this.truncate(safeBody)}` : '',
        `Started at: ${new Date().toISOString()}`,
      ]
        .filter(Boolean)
        .join('\n'),
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          const sizeInfo = this.getResponseSizeInfo(data);
          const safeDataPreview = this.getResponsePreview(data, isSensitive);

          this.logger.log(
            [
              `[SUCCESS] ${method} ${url} - ${statusCode}`,
              `Duration: ${duration}ms`,
              sizeInfo ? `Response size: ${sizeInfo}` : undefined,
              safeDataPreview ? `Response preview: ${safeDataPreview}` : undefined,
              `Completed at: ${new Date().toISOString()}`,
            ]
              .filter(Boolean)
              .join('\n'),
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error?.status || 500;

          this.logger.error(
            [
              `[ERROR] ${method} ${url} - ${statusCode}`,
              `Duration: ${duration}ms`,
              `Error: ${error?.message}`,
              `Stack: ${error?.stack?.split('\n')[0] || 'N/A'}`,
              `Failed at: ${new Date().toISOString()}`,
            ].join('\n'),
          );
        },
      }),
    );
  }

  // ===== Helpers de logging seguro =====

  private isSensitiveRoute(url: string): boolean {
    const sensitiveRoutes = [
      '/auth/login',
      '/auth/reset-password',
      '/auth/change-temporary-password',
      '/users',
    ];
    return sensitiveRoutes.some((route) => url.includes(route));
  }

  private isMultipart(headers: Record<string, any>): boolean {
    const ct = (headers?.['content-type'] || headers?.['Content-Type'] || '').toString();
    return ct.includes('multipart/form-data');
  }

  private truncate(text: string, max = this.MAX_LOG_CHARS): string {
    if (!text) return text;
    return text.length > max ? `${text.slice(0, max)}…[truncated]` : text;
  }

  private safeJson(value: any): string {
    if (value === undefined) return '';
    try {
      return JSON.stringify(value);
    } catch {
      // Pode ter referência circular – tenta uma versão simplificada
      try {
        const cache = new Set<any>();
        const replacer = (_key: string, val: any) => {
          if (typeof val === 'object' && val !== null) {
            if (cache.has(val)) return '[Circular]';
            cache.add(val);
          }
          return val;
        };
        return JSON.stringify(value, replacer);
      } catch {
        return '[Unserializable]';
      }
    }
  }

  private isReadableStream(obj: any): boolean {
    return obj instanceof Readable || (obj && typeof obj.pipe === 'function');
  }

  private getResponseSizeInfo(data: any): string | undefined {
    try {
      if (data == null) return undefined;

      // StreamableFile -> não sabemos o tamanho aqui
      if (data instanceof StreamableFile) return 'stream (StreamableFile)';

      // Buffer ou Uint8Array
      if (Buffer.isBuffer(data)) return `${data.byteLength} bytes (Buffer)`;
      if (data instanceof Uint8Array) return `${data.byteLength} bytes (Uint8Array)`;

      // String
      if (typeof data === 'string') return `${Buffer.byteLength(data, 'utf8')} bytes (string)`;

      // Array
      if (Array.isArray(data)) return `array length=${data.length}`;

      // Readable stream
      if (this.isReadableStream(data)) return 'stream (Readable)';

      // Observable (não deveria chegar aqui dentro do tap, mas por via das dúvidas)
      if (isObservable(data)) return 'Observable';

      // Objeto serializável
      const json = this.safeJson(data);
      if (json) return `${Buffer.byteLength(json, 'utf8')} bytes (json)`;

      return undefined;
    } catch {
      return undefined;
    }
  }

  private getResponsePreview(data: any, isSensitive: boolean): string | undefined {
    if (isSensitive) return undefined;

    try {
      if (data == null) return undefined;

      if (data instanceof StreamableFile) return '[StreamableFile]';
      if (Buffer.isBuffer(data)) return '[Buffer]';
      if (this.isReadableStream(data)) return '[Readable stream]';

      if (typeof data === 'string') return this.truncate(data);

      // Para objetos/arrays, mostra um preview truncado
      const json = this.safeJson(data);
      return this.truncate(json);
    } catch {
      return undefined;
    }
  }
}
