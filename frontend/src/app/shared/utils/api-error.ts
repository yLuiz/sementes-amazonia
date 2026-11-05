import { HttpErrorResponse } from '@angular/common/http';

export const GENERIC_ERROR_MESSAGE = 'Não foi possível concluir a operação. Tente novamente.';
export const NETWORK_ERROR_MESSAGE = 'Sem conexão com o servidor. Verifique a internet e tente novamente.';
export const FILE_TOO_LARGE_MESSAGE = 'Imagem acima de 5 MB.';
export const TOO_MANY_REQUESTS_MESSAGE = 'Muitas tentativas. Aguarde um pouco e tente novamente.';

const withPeriod = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

/** `message` da API, em texto ou lista, pronto para mostrar; vazio se não houver. */
function messageFromBody(body: unknown): string {
  const message = (body as { message?: unknown } | null | undefined)?.message;
  const parts = Array.isArray(message) ? message : [message];
  return parts
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .map((part) => withPeriod(part.trim()))
    .join(' ');
}

/**
 * Mensagem para o usuário a partir de um erro da API.
 * Um 5xx sempre usa `fallback`: o texto do contrato é genérico e o de quem chamou
 * diz o que falhou. Assim um detalhe interno também nunca chega à tela.
 */
export function apiErrorMessage(error: unknown, fallback = GENERIC_ERROR_MESSAGE): string {
  if (!(error instanceof HttpErrorResponse)) return fallback;
  if (error.status === 0) return NETWORK_ERROR_MESSAGE;
  if (error.status === 413) return FILE_TOO_LARGE_MESSAGE;
  if (error.status >= 500) return fallback;

  const message = messageFromBody(error.error);
  if (message) return message;
  return error.status === 429 ? TOO_MANY_REQUESTS_MESSAGE : fallback;
}

/** O registro não existe: 404, ou 400 quando o id do endereço é inválido. */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof HttpErrorResponse && (error.status === 404 || error.status === 400);
}
