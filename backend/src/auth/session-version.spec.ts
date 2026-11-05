import { createHmac } from 'crypto';
import { isSessionVersionValid, sessionVersion } from './session-version';

describe('session version', () => {
  const HASH = '$2b$10$abcdefghijklmnopqrstuuABCDEFGHIJKLMNOPQRSTUVWXYZ01234';
  const SECRET = 'segredo-de-teste';

  describe('sessionVersion', () => {
    it('é o HMAC-SHA256 do hash, em hexadecimal, truncado em 32 caracteres', () => {
      const full = createHmac('sha256', SECRET).update(HASH).digest('hex');
      expect(sessionVersion(HASH, SECRET)).toBe(full.slice(0, 32));
      expect(sessionVersion(HASH, SECRET)).toHaveLength(32);
    });

    it('é estável para o mesmo hash', () => {
      expect(sessionVersion(HASH, SECRET)).toBe(sessionVersion(HASH, SECRET));
    });

    it('muda quando a senha muda', () => {
      expect(sessionVersion(`${HASH}x`, SECRET)).not.toBe(sessionVersion(HASH, SECRET));
    });

    it('muda quando o segredo muda', () => {
      expect(sessionVersion(HASH, 'outro-segredo')).not.toBe(sessionVersion(HASH, SECRET));
    });

    it('não expõe o hash', () => {
      expect(sessionVersion(HASH, SECRET)).not.toContain(HASH.slice(7, 20));
    });
  });

  describe('isSessionVersionValid', () => {
    it('aceita o valor calculado para o hash atual', () => {
      expect(isSessionVersionValid(sessionVersion(HASH, SECRET), HASH, SECRET)).toBe(true);
    });

    it('recusa o valor de uma senha anterior', () => {
      const old = sessionVersion('$2b$10$hash-antigo', SECRET);
      expect(isSessionVersionValid(old, HASH, SECRET)).toBe(false);
    });

    it('recusa um valor calculado com outro segredo', () => {
      const forged = sessionVersion(HASH, 'outro-segredo');
      expect(isSessionVersionValid(forged, HASH, SECRET)).toBe(false);
    });

    it.each([
      ['ausente', undefined],
      ['nulo', null],
      ['número', 123],
      ['objeto', {}],
      ['vazio', ''],
      ['mais curto', 'abc'],
      ['mais longo', 'a'.repeat(33)],
      ['multibyte do mesmo comprimento', 'á'.repeat(32)],
    ])('recusa claim %s sem lançar erro', (_name, claim) => {
      expect(isSessionVersionValid(claim, HASH, SECRET)).toBe(false);
    });
  });
});
