import {
  ATTEMPT_WINDOW_MS,
  BLOCK_DURATION_MS,
  LoginAttemptsService,
  MAX_FAILED_ATTEMPTS,
  MAX_TRACKED_USERNAMES,
} from './login-attempts.service';

describe('LoginAttemptsService', () => {
  const START = new Date('2026-11-05T12:00:00Z').getTime();
  let service: LoginAttemptsService;

  const advance = (ms: number) => jest.setSystemTime(Date.now() + ms);
  const fail = (username: string, times = 1) => {
    for (let i = 0; i < times; i++) {
      expect(service.acquire(username)).toBe(0);
    }
  };
  const tracked = () => (service as any).failures as Map<string, number[]>;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(START);
    service = new LoginAttemptsService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('limite', () => {
    it('libera até a décima tentativa e bloqueia a seguinte', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('informa a espera em segundos, arredondada para cima', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('admin')).toBe(BLOCK_DURATION_MS / 1000);

      advance(1500);
      expect(service.acquire('admin')).toBe(BLOCK_DURATION_MS / 1000 - 1);
    });

    it('tentativas durante o bloqueio não o prolongam', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      advance(BLOCK_DURATION_MS - 1000);
      service.acquire('admin');

      advance(1000);
      expect(service.acquire('admin')).toBe(0);
    });

    it('trata maiúsculas e espaços nas pontas como o mesmo usuário', () => {
      fail('admin', MAX_FAILED_ATTEMPTS - 2);
      fail('  ADMIN ');
      fail('Admin');
      expect(service.acquire('aDmIn')).toBeGreaterThan(0);
    });

    it('não afeta outros usuários', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('outro')).toBe(0);
    });
  });

  describe('janela', () => {
    it('não conta falhas mais antigas que a janela', () => {
      fail('admin', MAX_FAILED_ATTEMPTS - 1);
      advance(ATTEMPT_WINDOW_MS);
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('a janela desliza: só saem da conta as falhas que venceram', () => {
      fail('admin', 5);
      advance(ATTEMPT_WINDOW_MS - 1000);
      fail('admin', 4);
      advance(1000);

      // As 5 primeiras venceram agora; restam 4 e cabem mais 6.
      fail('admin', 6);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('o bloqueio termina depois de 15 minutos e a contagem recomeça', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      advance(BLOCK_DURATION_MS - 1);
      expect(service.acquire('admin')).toBeGreaterThan(0);

      advance(1);
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });
  });

  describe('reinício', () => {
    it('reset zera a contagem', () => {
      fail('admin', MAX_FAILED_ATTEMPTS - 1);
      service.reset('  ADMIN ');
      fail('admin', MAX_FAILED_ATTEMPTS);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('release devolve a tentativa, inclusive a que chegaria ao limite', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      service.release('admin');
      fail('admin');
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('release remove a chave quando não sobra nada e ignora usuário desconhecido', () => {
      fail('admin');
      service.release('admin');
      service.release('ninguem');
      expect(tracked().size).toBe(0);
    });
  });

  describe('descarte', () => {
    it('descarta entradas vencidas na tentativa seguinte de qualquer usuário', () => {
      fail('um');
      fail('dois', MAX_FAILED_ATTEMPTS);
      advance(Math.max(ATTEMPT_WINDOW_MS, BLOCK_DURATION_MS));

      fail('tres');
      expect([...tracked().keys()]).toEqual(['tres']);
    });

    it('mantém entradas ainda válidas', () => {
      fail('um');
      advance(ATTEMPT_WINDOW_MS - 1);

      fail('dois');
      expect([...tracked().keys()].sort()).toEqual(['dois', 'um']);
    });
  });

  describe('limite do mapa', () => {
    const fill = (prefix: string, count: number, failures = 1) => {
      for (let i = 0; i < count; i++) {
        fail(`${prefix}${i}`, failures);
      }
    };

    it('nunca passa do limite de chaves e descarta primeiro a mais antiga', () => {
      fill('u', MAX_TRACKED_USERNAMES);
      fail('novo');

      expect(tracked().size).toBe(MAX_TRACKED_USERNAMES);
      expect(tracked().has('novo')).toBe(true);
      expect(tracked().has('u0')).toBe(false);
      expect(tracked().has('u1')).toBe(true);
    });

    it('nomes aleatórios não liberam um usuário bloqueado', () => {
      fail('admin', MAX_FAILED_ATTEMPTS);
      fill('u', MAX_TRACKED_USERNAMES + 50);

      expect(tracked().size).toBe(MAX_TRACKED_USERNAMES);
      expect(service.acquire('admin')).toBeGreaterThan(0);
    });

    it('com o mapa cheio de vencidos, abre espaço sem descartar os válidos', () => {
      // A limpeza periódica roda em `atual`; 30 s depois ela ainda não está
      // prevista, então só a falta de espaço pode descartar os vencidos.
      fill('velho', MAX_TRACKED_USERNAMES - 1);
      advance(ATTEMPT_WINDOW_MS - 30_000);
      fail('atual');
      expect(tracked().size).toBe(MAX_TRACKED_USERNAMES);

      advance(30_000);
      fail('novo');

      expect([...tracked().keys()].sort()).toEqual(['atual', 'novo']);
    });

    it('com todos bloqueados, ainda respeita o limite', () => {
      fill('u', MAX_TRACKED_USERNAMES, MAX_FAILED_ATTEMPTS);
      fail('novo');

      expect(tracked().size).toBe(MAX_TRACKED_USERNAMES);
      expect(tracked().has('novo')).toBe(true);
    });
  });
});
