import { mkdtemp, readdir, rm, utimes, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import {
  deleteImageVariants,
  ensureVariant,
  hasImmutableName,
  hasSupportedImageSignature,
  isProcessableImage,
  isSafeFilename,
  parseVariantWidth,
  resolveUploadPath,
  variantFilename,
  variantsDir,
} from './media-variants';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const sharp = require('sharp') as (typeof import('sharp'))['default'];

describe('parseVariantWidth', () => {
  it('sem parâmetro devolve undefined', () => {
    expect(parseVariantWidth(undefined)).toBeUndefined();
  });

  it.each(['320', '640', '960', '1280', '1920'])('aceita %s', (value) => {
    expect(parseVariantWidth(value)).toBe(Number(value));
  });

  it.each([
    '',
    '0',
    '100',
    '641',
    '-640',
    '0640',
    '640.0',
    '+640',
    '6.4e2',
    ' 640',
    '640px',
    '99999999',
    'abc',
    'toString',
    '__proto__',
  ])('recusa %j', (value) => {
    expect(parseVariantWidth(value)).toBeNull();
  });

  it('recusa parâmetro repetido e objeto', () => {
    expect(parseVariantWidth(['640', '960'])).toBeNull();
    expect(parseVariantWidth({ a: '640' })).toBeNull();
  });
});

describe('isSafeFilename', () => {
  it.each([
    'abc.webp',
    'demo-canopy-v4.webp',
    'foto 1.JPG',
    '6f1c1c52-8f43-4b53-9d6a-2f8e0c3b7a11.png',
  ])('aceita %j', (name) => {
    expect(isSafeFilename(name)).toBe(true);
  });

  it.each([
    '',
    '.',
    '..',
    '.env',
    '.gitkeep',
    '../.env',
    '..\\.env',
    'a/b.png',
    'a\\b.png',
    'variants/a.png.w320.webp',
    '/etc/passwd',
    'C:\\Windows\\win.ini',
    'C:win.ini',
    'a.png:stream',
    'a.png\0.jpg',
    'a\n.png',
    'a.png.',
    'a.png ',
    'a'.repeat(256),
  ])('recusa %j', (name) => {
    expect(isSafeFilename(name)).toBe(false);
  });

  it('recusa o que não é texto', () => {
    expect(isSafeFilename(undefined)).toBe(false);
    expect(isSafeFilename(['a.png'])).toBe(false);
  });
});

describe('resolveUploadPath', () => {
  const base = join(tmpdir(), 'uploads');

  it('resolve um arquivo diretamente na pasta', () => {
    expect(resolveUploadPath(base, 'a.png')).toBe(join(base, 'a.png'));
  });

  it('não confunde pasta vizinha com o mesmo prefixo', () => {
    expect(resolveUploadPath(base, '../uploads-secret/a.png')).toBeNull();
  });
});

describe('demais regras de nome e assinatura', () => {
  it('processa só jpg, jpeg, png e webp', () => {
    for (const name of ['a.jpg', 'a.JPEG', 'a.png', 'a.webp'])
      expect(isProcessableImage(name)).toBe(true);
    for (const name of ['a.gif', 'a.svg', 'a.pdf', 'a', 'a.png.exe'])
      expect(isProcessableImage(name)).toBe(false);
  });

  it('considera imutável só o nome gerado no upload', () => {
    expect(hasImmutableName('6f1c1c52-8f43-4b53-9d6a-2f8e0c3b7a11.png')).toBe(
      true,
    );
    expect(hasImmutableName('demo-canopy-v4.webp')).toBe(false);
  });

  it('reconhece as assinaturas aceitas e recusa as demais', () => {
    expect(
      hasSupportedImageSignature(Buffer.from([0xff, 0xd8, 0xff, 0xe0])),
    ).toBe(true);
    expect(
      hasSupportedImageSignature(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      ),
    ).toBe(true);
    expect(hasSupportedImageSignature(Buffer.from('RIFF\0\0\0\0WEBP'))).toBe(
      true,
    );
    expect(hasSupportedImageSignature(Buffer.from('<svg xmlns="http'))).toBe(
      false,
    );
    expect(hasSupportedImageSignature(Buffer.from('RIFF\0\0\0\0WAVE'))).toBe(
      false,
    );
    expect(hasSupportedImageSignature(Buffer.alloc(0))).toBe(false);
  });
});

describe('geração de variantes', () => {
  let dir: string;

  const image = (width: number, height: number) =>
    sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 30, g: 120, b: 60 },
      },
    });

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'media-variants-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const variantMeta = (
    filename: string,
    width: 320 | 640 | 960 | 1280 | 1920,
  ) =>
    sharp(join(variantsDir(dir), variantFilename(filename, width))).metadata();

  it('reduz para a largura pedida, em WebP', async () => {
    await image(2000, 1000).png().toFile(join(dir, 'a.png'));
    await ensureVariant(dir, 'a.png', 640);
    const meta = await variantMeta('a.png', 640);
    expect([meta.format, meta.width, meta.height]).toEqual(['webp', 640, 320]);
  });

  it('nunca amplia', async () => {
    await image(200, 100).jpeg().toFile(join(dir, 'a.jpg'));
    await ensureVariant(dir, 'a.jpg', 1920);
    const meta = await variantMeta('a.jpg', 1920);
    expect([meta.width, meta.height]).toEqual([200, 100]);
  });

  it('respeita a orientação EXIF', async () => {
    await image(800, 400)
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toFile(join(dir, 'a.jpg'));
    await ensureVariant(dir, 'a.jpg', 320);
    const meta = await variantMeta('a.jpg', 320);
    expect([meta.width, meta.height]).toEqual([320, 640]);
  });

  it('pedidos simultâneos deixam um único arquivo válido e nenhum temporário', async () => {
    await image(2000, 1000).png().toFile(join(dir, 'a.png'));
    await Promise.all(
      Array.from({ length: 20 }, () => ensureVariant(dir, 'a.png', 640)),
    );
    expect(await readdir(variantsDir(dir))).toEqual([
      variantFilename('a.png', 640),
    ]);
    expect((await variantMeta('a.png', 640)).width).toBe(640);
  });

  it('reaproveita o arquivo já gerado e refaz se o original mudar', async () => {
    const source = join(dir, 'a.png');
    await image(2000, 1000).png().toFile(source);
    await ensureVariant(dir, 'a.png', 320);
    const target = join(variantsDir(dir), variantFilename('a.png', 320));

    await writeFile(target, 'marcador');
    const future = new Date(Date.now() + 60_000);
    await utimes(target, future, future);
    await ensureVariant(dir, 'a.png', 320);
    await expect(sharp(target).metadata()).rejects.toThrow();

    await utimes(
      source,
      new Date(future.getTime() + 60_000),
      new Date(future.getTime() + 60_000),
    );
    await ensureVariant(dir, 'a.png', 320);
    expect((await sharp(target).metadata()).format).toBe('webp');
  });

  it('rejeita arquivo corrompido sem deixar sobra', async () => {
    const header = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ]);
    await writeFile(
      join(dir, 'a.png'),
      Buffer.concat([header, Buffer.from('lixo'.repeat(100))]),
    );
    await expect(ensureVariant(dir, 'a.png', 640)).rejects.toThrow();
    expect(await readdir(variantsDir(dir))).toEqual([]);
  });

  it('não entrega ao sharp outro formato com extensão de imagem', async () => {
    await writeFile(
      join(dir, 'a.png'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>',
    );
    await expect(ensureVariant(dir, 'a.png', 640)).rejects.toThrow(
      'não é JPEG',
    );
  });

  it('recusa nome inseguro', async () => {
    await expect(ensureVariant(dir, '../a.png', 640)).rejects.toThrow(
      'inválido',
    );
  });

  it('apaga só as variantes do arquivo indicado', async () => {
    await image(800, 400).png().toFile(join(dir, 'a.png'));
    await image(800, 400).png().toFile(join(dir, 'b.png'));
    await Promise.all([
      ensureVariant(dir, 'a.png', 320),
      ensureVariant(dir, 'a.png', 640),
      ensureVariant(dir, 'b.png', 320),
    ]);

    await deleteImageVariants('a.png', dir);

    expect(await readdir(variantsDir(dir))).toEqual([
      variantFilename('b.png', 320),
    ]);
    expect((await readdir(dir)).sort()).toEqual(['a.png', 'b.png', 'variants']);
  });

  it('a exclusão ignora URL externa, valor vazio e pasta sem variantes', async () => {
    await expect(
      deleteImageVariants('https://example.com/a.jpg', dir),
    ).resolves.toBeUndefined();
    await expect(deleteImageVariants(null, dir)).resolves.toBeUndefined();
    await expect(deleteImageVariants('a.png', dir)).resolves.toBeUndefined();
  });
});

describe('sharp indisponível', () => {
  it('rejeita a geração, em vez de impedir o carregamento do módulo', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'media-variants-'));
    const source = await sharp({
      create: { width: 10, height: 10, channels: 3, background: '#000' },
    })
      .png()
      .toBuffer();
    await writeFile(join(dir, 'a.png'), source);

    await jest.isolateModulesAsync(async () => {
      jest.doMock('sharp', () => {
        throw new Error('binário ausente');
      });
      const isolated = await import('./media-variants');
      await expect(isolated.ensureVariant(dir, 'a.png', 320)).rejects.toThrow(
        'binário ausente',
      );
    });

    jest.dontMock('sharp');
    await rm(dir, { recursive: true, force: true });
  });
});
