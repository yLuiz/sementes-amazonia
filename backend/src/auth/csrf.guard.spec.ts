import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { CSRF_HEADER, CSRF_HEADER_VALUE, CsrfGuard } from './csrf.guard';

const contextFor = (method: string, headers: Record<string, string> = {}) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ method, headers }) }) }) as unknown as ExecutionContext;

describe('CsrfGuard', () => {
  const guard = new CsrfGuard();

  it.each(['GET', 'HEAD', 'OPTIONS'])('libera %s sem o cabeçalho', (method) => {
    expect(guard.canActivate(contextFor(method))).toBe(true);
  });

  it.each(['POST', 'PUT', 'PATCH', 'DELETE'])('recusa %s sem o cabeçalho', (method) => {
    expect(() => guard.canActivate(contextFor(method))).toThrow(ForbiddenException);
  });

  it('recusa um valor diferente do esperado', () => {
    expect(() => guard.canActivate(contextFor('POST', { [CSRF_HEADER]: 'XMLHttpRequest' }))).toThrow(ForbiddenException);
  });

  it('libera escrita com o cabeçalho da aplicação', () => {
    expect(guard.canActivate(contextFor('POST', { [CSRF_HEADER]: CSRF_HEADER_VALUE }))).toBe(true);
  });
});
