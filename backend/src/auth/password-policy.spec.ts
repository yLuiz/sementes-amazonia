import * as bcrypt from 'bcryptjs';
import { DUMMY_PASSWORD_HASH } from './password-policy';

describe('DUMMY_PASSWORD_HASH', () => {
  it('tem o mesmo custo dos hashes reais', () => {
    expect(bcrypt.getRounds(DUMMY_PASSWORD_HASH)).toBe(10);
  });

  it('é um hash válido que recusa senhas', async () => {
    await expect(bcrypt.compare('admin123', DUMMY_PASSWORD_HASH)).resolves.toBe(false);
  });
});
