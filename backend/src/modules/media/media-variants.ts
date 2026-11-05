import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, open, rename, rm, stat } from 'fs/promises';
import { dirname, extname, join, resolve } from 'path';
import { UPLOAD_DIR } from '../../config/multer.config';

type SharpFactory = (typeof import('sharp'))['default'];

/** Lista fechada: cada largura vira um arquivo em disco, então não pode ser livre. */
export const VARIANT_WIDTHS = [320, 640, 960, 1280, 1920] as const;
export type VariantWidth = (typeof VARIANT_WIDTHS)[number];

export const VARIANTS_DIRNAME = 'variants';

const WEBP_QUALITY = 80;
// Protege contra "bombas" de descompressão: um PNG de 5 MB pode declarar bilhões de pixels.
const MAX_INPUT_PIXELS = 50_000_000;
const GENERATION_TIMEOUT_SECONDS = 30;
// Sem esse teto, a primeira visita após um deploy decodifica muitas fotos ao mesmo
// tempo, e estouro de memória derruba o processo sem passar por nenhum try/catch.
const MAX_CONCURRENT_GENERATIONS = 2;

const PROCESSABLE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);
const UUID_FILENAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/i;

const logger = new Logger('MediaVariants');

/**
 * Lê `?w=`. Devolve `undefined` sem o parâmetro e `null` quando ele é inválido.
 * Compara o texto exato, então `0640`, `640.0`, `6.4e2` e `w=640&w=960` não passam.
 */
export function parseVariantWidth(
  raw: unknown,
): VariantWidth | null | undefined {
  if (raw === undefined) return undefined;
  if (typeof raw !== 'string') return null;
  return VARIANT_WIDTHS.find((width) => String(width) === raw) ?? null;
}

/**
 * Aceita só um nome simples de arquivo. Além de separadores, recusa `:` (fluxos
 * alternativos do NTFS), nomes iniciados por ponto (`..`, `.env`) e nomes terminados
 * em ponto ou espaço, que o Windows abre como se fossem o arquivo sem esse final.
 */
export function isSafeFilename(name: unknown): name is string {
  if (typeof name !== 'string' || !name || name.length > 255) return false;
  // eslint-disable-next-line no-control-regex
  if (/[/\\:\x00-\x1f\x7f]/.test(name)) return false;
  return !name.startsWith('.') && !/[. ]$/.test(name);
}

/** Caminho do arquivo diretamente dentro de `baseDir`, ou `null` se o nome não for seguro. */
export function resolveUploadPath(
  baseDir: string,
  filename: unknown,
): string | null {
  if (!isSafeFilename(filename)) return null;
  const base = resolve(baseDir);
  const full = resolve(base, filename);
  return dirname(full) === base ? full : null;
}

export function isProcessableImage(filename: string): boolean {
  return PROCESSABLE_EXTENSIONS.has(extname(filename).slice(1).toLowerCase());
}

/** Só nomes gerados no upload (UUID) nunca mudam de conteúdo; os demais podem ser sobrescritos. */
export function hasImmutableName(filename: string): boolean {
  return UUID_FILENAME.test(filename);
}

/**
 * Confere a assinatura real do arquivo. A extensão vem do cliente no upload, e o sharp
 * também abre formatos como SVG e PDF, que não devem ser interpretados aqui.
 */
export function hasSupportedImageSignature(header: Buffer): boolean {
  const isJpeg = header.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
  const isPng = header
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    header.subarray(0, 4).toString('latin1') === 'RIFF' &&
    header.subarray(8, 12).toString('latin1') === 'WEBP';
  return isJpeg || isPng || isWebp;
}

export function variantFilename(filename: string, width: VariantWidth): string {
  return `${filename}.w${width}.webp`;
}

export function variantsDir(uploadDir: string): string {
  return join(resolve(uploadDir), VARIANTS_DIRNAME);
}

let sharpFactory: SharpFactory | undefined;

/**
 * Carrega o sharp só no primeiro uso. O binário nativo é a parte frágil do deploy: se
 * ele falhar, as imagens caem no original, em vez de a API inteira não subir.
 */
function loadSharp(): SharpFactory {
  if (!sharpFactory) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const loaded = require('sharp') as SharpFactory;
    // O cache da libvips retém memória e, no Windows, mantém os arquivos abertos.
    loaded.cache(false);
    sharpFactory = loaded;
  }
  return sharpFactory;
}

let runningGenerations = 0;
const waitingGenerations: Array<() => void> = [];

async function withGenerationSlot<T>(task: () => Promise<T>): Promise<T> {
  if (runningGenerations >= MAX_CONCURRENT_GENERATIONS) {
    // Quem libera a vaga a repassa diretamente, sem alterar o contador.
    await new Promise<void>((release) => waitingGenerations.push(release));
  } else {
    runningGenerations++;
  }
  try {
    return await task();
  } finally {
    const next = waitingGenerations.shift();
    if (next) next();
    else runningGenerations--;
  }
}

async function readHeader(path: string): Promise<Buffer> {
  const handle = await open(path, 'r');
  try {
    const { buffer, bytesRead } = await handle.read(Buffer.alloc(12), 0, 12, 0);
    return buffer.subarray(0, bytesRead);
  } finally {
    await handle.close();
  }
}

async function generateVariant(
  source: string,
  target: string,
  width: VariantWidth,
): Promise<void> {
  if (!hasSupportedImageSignature(await readHeader(source))) {
    throw new Error('conteúdo não é JPEG, PNG nem WebP');
  }

  await mkdir(dirname(target), { recursive: true });
  // Nome único e rename no fim: quem lê nunca encontra um arquivo pela metade.
  const temporary = `${target}.${randomUUID()}.tmp`;
  try {
    const sharp = loadSharp();
    await sharp(source, { limitInputPixels: MAX_INPUT_PIXELS })
      .rotate() // aplica a orientação EXIF antes de medir a largura
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .timeout({ seconds: GENERATION_TIMEOUT_SECONDS })
      .toFile(temporary);
    await rename(temporary, target);
  } catch (error) {
    await rm(temporary, { force: true }).catch(() => undefined);
    throw error;
  }
}

// Pedidos simultâneos da mesma variante esperam a mesma geração.
const inFlight = new Map<string, Promise<string>>();

/**
 * Garante a variante em disco e devolve o nome dela dentro de `variantsDir`. Rejeita
 * quando o original não pode ser processado; quem chama decide cair no original.
 */
export function ensureVariant(
  uploadDir: string,
  filename: string,
  width: VariantWidth,
): Promise<string> {
  const source = resolveUploadPath(uploadDir, filename);
  if (!source) return Promise.reject(new Error('nome de arquivo inválido'));

  const name = variantFilename(filename, width);
  const target = join(variantsDir(uploadDir), name);

  const current = inFlight.get(target);
  if (current) return current;

  // A checagem do disco fica dentro da promessa registrada para não haver intervalo
  // em que um segundo pedido não veja nem o arquivo nem a geração em andamento.
  const job = (async () => {
    const [sourceInfo, targetInfo] = await Promise.all([
      stat(source),
      stat(target).catch(() => null),
    ]);
    if (!targetInfo?.isFile() || targetInfo.mtimeMs < sourceInfo.mtimeMs) {
      await withGenerationSlot(() => generateVariant(source, target, width));
    }
    return name;
  })().finally(() => inFlight.delete(target));

  inFlight.set(target, job);
  return job;
}

/**
 * Apaga as variantes de um arquivo. Aceita qualquer valor de imagem salvo no banco: URLs
 * externas e nomes inválidos não fazem nada. Não rejeita, para que uma falha aqui não
 * impeça a exclusão da notícia ou do projeto.
 */
export async function deleteImageVariants(
  filename?: string | null,
  uploadDir: string = UPLOAD_DIR,
): Promise<void> {
  if (!isSafeFilename(filename)) return;
  await Promise.all(
    VARIANT_WIDTHS.map(async (width) => {
      const target = join(
        variantsDir(uploadDir),
        variantFilename(filename, width),
      );
      try {
        // Uma geração em andamento gravaria o arquivo depois da exclusão.
        await inFlight.get(target)?.catch(() => undefined);
        await rm(target, { force: true });
      } catch (error) {
        logger.warn(
          `Falha ao remover variante de "${filename}": ${(error as Error).message}`,
        );
      }
    }),
  );
}
