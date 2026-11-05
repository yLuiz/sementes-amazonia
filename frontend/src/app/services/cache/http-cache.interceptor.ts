import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { of, tap } from 'rxjs';
import { apiConfig } from '../../config/api.config';

export const CACHE_TTL_MS = 60_000;

const READ_ONLY_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
// Lista do que entra, e não do que sai: `/auth/*` e `/health` nunca são guardados.
const CACHEABLE_BASES = [apiConfig.news.base, apiConfig.projects.base];

const isCacheable = (req: HttpRequest<unknown>) => {
  const path = req.url.split('?')[0];
  return req.method === 'GET' && CACHEABLE_BASES.some((base) => path === base || path.startsWith(`${base}/`));
};

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiresAt: number;
}

/** Respostas de leitura guardadas em memória, por pouco tempo. */
@Injectable({ providedIn: 'root' })
export class HttpCacheService {
  private readonly entries = new Map<string, CacheEntry>();
  private currentVersion = 0;

  /** Muda a cada limpeza; uma leitura iniciada em outra versão pode estar velha. */
  get version(): number {
    return this.currentVersion;
  }

  get(key: string): HttpResponse<unknown> | null {
    const entry = this.entries.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return null;
    }
    return entry.response;
  }

  set(key: string, response: HttpResponse<unknown>, version: number): void {
    if (version !== this.currentVersion) return;
    this.removeExpired();
    this.entries.set(key, { response, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  clear(): void {
    this.entries.clear();
    this.currentVersion++;
  }

  // Cada termo de busca gera uma chave; sem isto o mapa cresceria durante a sessão.
  private removeExpired(): void {
    const now = Date.now();
    this.entries.forEach((entry, key) => {
      if (entry.expiresAt <= now) this.entries.delete(key);
    });
  }
}

/** Evita repetir leituras públicas e descarta tudo depois de uma escrita bem-sucedida. */
export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  const cache = inject(HttpCacheService);

  if (!READ_ONLY_METHODS.has(req.method)) {
    return next(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse && event.ok && req.url.startsWith('/api/')) cache.clear();
      }),
    );
  }

  if (!isCacheable(req)) return next(req);

  const key = req.urlWithParams;
  const cached = cache.get(key);
  if (cached) return of(cached.clone());

  const version = cache.version;
  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse && event.ok) cache.set(key, event.clone(), version);
    }),
  );
};
