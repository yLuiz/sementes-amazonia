import { Injectable } from '@nestjs/common';

export const MAX_FAILED_ATTEMPTS = 10;
export const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
export const BLOCK_DURATION_MS = 15 * 60 * 1000;
export const MAX_TRACKED_USERNAMES = 10_000;

const SWEEP_INTERVAL_MS = 60 * 1000;

/**
 * Limite de tentativas de login por usuário informado, em memória.
 *
 * A chave não usa IP: atrás da Vercel e da Railway ele não é confiável, e quem
 * acessa a Railway direto pode forjar `X-Forwarded-For`.
 */
@Injectable()
export class LoginAttemptsService {
  // Horário de cada falha recente. Um usuário tem no máximo MAX_FAILED_ATTEMPTS
  // registros, e o bloqueio vale a partir do último deles.
  private readonly failures = new Map<string, number[]>();
  private lastSweepAt = 0;

  /**
   * Devolve os segundos de espera se o usuário está bloqueado, ou 0 se pode tentar.
   *
   * A tentativa já entra na contagem aqui, antes da comparação da senha: o bcrypt
   * é assíncrono, e checar só depois deixaria requisições simultâneas passarem
   * juntas pelo limite. Quem acerta chama `reset`, então no fim só falhas contam.
   */
  acquire(username: string): number {
    const now = Date.now();
    this.sweepIfDue(now);

    const key = this.normalize(username);
    const current = this.failures.get(key);

    if (current && this.isBlocked(current, now)) {
      const blockedUntil = current[current.length - 1] + BLOCK_DURATION_MS;
      return Math.ceil((blockedUntil - now) / 1000);
    }

    if (!current) {
      this.makeRoom(now);
    }

    // Quem chegou ao limite aqui já cumpriu o bloqueio e recomeça do zero.
    const recent =
      current && current.length < MAX_FAILED_ATTEMPTS
        ? current.filter((at) => now - at < ATTEMPT_WINDOW_MS)
        : [];
    recent.push(now);
    this.failures.set(key, recent);
    return 0;
  }

  /** Desfaz uma tentativa que não chegou a comparar a senha, como numa falha do banco. */
  release(username: string): void {
    const key = this.normalize(username);
    const current = this.failures.get(key);
    if (!current) {
      return;
    }

    current.pop();
    if (current.length === 0) {
      this.failures.delete(key);
    }
  }

  reset(username: string): void {
    this.failures.delete(this.normalize(username));
  }

  private normalize(username: string): string {
    return username.trim().toLowerCase();
  }

  private isBlocked(failures: number[], now: number): boolean {
    return (
      failures.length >= MAX_FAILED_ATTEMPTS &&
      now - failures[failures.length - 1] < BLOCK_DURATION_MS
    );
  }

  private isExpired(failures: number[], now: number): boolean {
    const lifetime = Math.max(ATTEMPT_WINDOW_MS, BLOCK_DURATION_MS);
    return now - failures[failures.length - 1] >= lifetime;
  }

  private sweepIfDue(now: number): void {
    if (now - this.lastSweepAt >= SWEEP_INTERVAL_MS) {
      this.sweep(now);
    }
  }

  private sweep(now: number): void {
    this.lastSweepAt = now;
    for (const [key, failures] of this.failures) {
      if (this.isExpired(failures, now)) {
        this.failures.delete(key);
      }
    }
  }

  private makeRoom(now: number): void {
    if (this.failures.size < MAX_TRACKED_USERNAMES) {
      return;
    }

    this.sweep(now);
    if (this.failures.size < MAX_TRACKED_USERNAMES) {
      return;
    }

    // Preserva os bloqueios: senão, inundar o mapa com nomes aleatórios bastaria
    // para liberar um usuário bloqueado. O Map percorre do registro mais antigo.
    let victim: string | undefined;
    for (const [key, failures] of this.failures) {
      if (!this.isBlocked(failures, now)) {
        victim = key;
        break;
      }
    }
    victim ??= this.failures.keys().next().value;

    if (victim !== undefined) {
      this.failures.delete(victim);
    }
  }
}
