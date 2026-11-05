import { CookieOptions } from 'express';

export const SESSION_COOKIE = 'session';

// Fora do `/api` o cookie não tem utilidade, então nem é enviado.
// `COOKIE_SECURE=false` existe só para desenvolvimento em http.
export function sessionCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE !== 'false',
    sameSite: 'strict',
    path: '/api',
  };
}
