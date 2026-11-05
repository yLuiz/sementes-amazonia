import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_VERSION_LENGTH = 32;

/**
 * Valor do claim `sv` do JWT. Muda junto com o hash da senha, o que encerra as
 * sessões antigas sem precisar de coluna nova. O HMAC evita colocar no token
 * qualquer coisa derivada do hash que possa ser verificada sem o segredo.
 */
export function sessionVersion(passwordHash: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(passwordHash)
    .digest('hex')
    .slice(0, SESSION_VERSION_LENGTH);
}

export function isSessionVersionValid(claim: unknown, passwordHash: string, secret: string): boolean {
  if (typeof claim !== 'string') {
    return false;
  }

  const received = Buffer.from(claim);
  const expected = Buffer.from(sessionVersion(passwordHash, secret));

  // timingSafeEqual lança erro com tamanhos diferentes.
  return received.length === expected.length && timingSafeEqual(received, expected);
}
