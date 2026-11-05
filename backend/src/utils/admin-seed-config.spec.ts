import { getAdminSeedConfig } from './admin-seed-config';

const valid = { ADMIN_USERNAME: 'gestor', ADMIN_EMAIL: 'gestor@exemplo.org', ADMIN_PASSWORD: 'uma-senha-bem-longa' };

describe('getAdminSeedConfig', () => {
  it('lê os dados do ambiente', () => {
    expect(getAdminSeedConfig(valid)).toEqual({
      username: 'gestor',
      email: 'gestor@exemplo.org',
      password: 'uma-senha-bem-longa',
    });
  });

  it('informa todas as variáveis que faltam', () => {
    expect(() => getAdminSeedConfig({})).toThrow('ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD');
  });

  it('recusa senha curta sem mostrar o valor', () => {
    let message = '';
    try {
      getAdminSeedConfig({ ...valid, ADMIN_PASSWORD: 'curta123' });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('ADMIN_PASSWORD precisa ter');
    expect(message).not.toContain('curta123');
  });
});
