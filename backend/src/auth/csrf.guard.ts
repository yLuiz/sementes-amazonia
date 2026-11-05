import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

export const CSRF_HEADER = 'x-requested-with';
export const CSRF_HEADER_VALUE = 'sementes-web';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Segunda camada contra CSRF, depois do `SameSite=Strict`: outra origem só
 * consegue enviar um cabeçalho próprio com autorização do CORS, que está fechado.
 */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { method, headers } = context.switchToHttp().getRequest();

    if (SAFE_METHODS.has(method) || headers[CSRF_HEADER] === CSRF_HEADER_VALUE) {
      return true;
    }

    throw new ForbiddenException('Requisição não permitida');
  }
}
