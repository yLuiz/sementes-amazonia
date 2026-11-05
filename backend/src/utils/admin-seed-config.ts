import { MAX_PASSWORD_LENGTH, MIN_PASSWORD_LENGTH } from '../auth/password-policy';

export interface AdminSeedConfig {
  username: string;
  email: string;
  password: string;
}

/** Dados do primeiro administrador. Sem eles o seed falha em vez de criar um usuário padrão. */
export function getAdminSeedConfig(env: NodeJS.ProcessEnv = process.env): AdminSeedConfig {
  const username = env.ADMIN_USERNAME?.trim();
  const email = env.ADMIN_EMAIL?.trim();
  const password = env.ADMIN_PASSWORD;

  const missing = [
    !username && 'ADMIN_USERNAME',
    !email && 'ADMIN_EMAIL',
    !password && 'ADMIN_PASSWORD',
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`Defina ${missing.join(', ')} no ambiente para criar o usuário administrador.`);
  }

  if (password!.length < MIN_PASSWORD_LENGTH || password!.length > MAX_PASSWORD_LENGTH) {
    throw new Error(`ADMIN_PASSWORD precisa ter entre ${MIN_PASSWORD_LENGTH} e ${MAX_PASSWORD_LENGTH} caracteres.`);
  }

  return { username: username!, email: email!, password: password! };
}
