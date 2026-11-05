// src/media/media.controller.ts
import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { stat } from 'fs/promises';
import { extname } from 'path';
import { UPLOAD_DIR } from '../../config/multer.config';
import {
  VARIANT_WIDTHS,
  ensureVariant,
  hasImmutableName,
  isProcessableImage,
  parseVariantWidth,
  resolveUploadPath,
  variantsDir,
} from './media-variants';

const ONE_YEAR = 'public, max-age=31536000';
// Se a geração falhou agora, o mesmo endereço pode funcionar depois.
const SHORT_CACHE = 'public, max-age=300';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

@ApiTags('Media')
@Controller('api/v1/media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  @Get(':filename')
  @ApiQuery({
    name: 'w',
    required: false,
    enum: [...VARIANT_WIDTHS],
    description: 'Largura da versão WebP',
  })
  async getFile(
    @Param('filename') filename: string,
    @Query('w') rawWidth: unknown,
    @Res() res: Response,
  ) {
    const width = parseVariantWidth(rawWidth);
    if (width === null) {
      throw new BadRequestException(
        `Largura inválida. Use uma destas: ${VARIANT_WIDTHS.join(', ')}.`,
      );
    }

    // O nome vem da URL: só um arquivo diretamente em UPLOAD_DIR, nunca a pasta de variantes.
    const original = resolveUploadPath(UPLOAD_DIR, filename);
    const info = original ? await stat(original).catch(() => null) : null;
    if (!info?.isFile()) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const longCache = hasImmutableName(filename)
      ? `${ONE_YEAR}, immutable`
      : ONE_YEAR;
    res.setHeader('X-Content-Type-Options', 'nosniff');

    if (width && isProcessableImage(filename)) {
      try {
        const variant = await ensureVariant(UPLOAD_DIR, filename, width);
        await this.send(
          res,
          variantsDir(UPLOAD_DIR),
          variant,
          'image/webp',
          longCache,
        );
        return;
      } catch (error) {
        this.logger.warn(
          `Variante ${width} de "${filename}" indisponível: ${(error as Error).message}`,
        );
        await this.sendOriginal(res, filename, SHORT_CACHE);
        return;
      }
    }

    await this.sendOriginal(res, filename, longCache);
  }

  private async sendOriginal(
    res: Response,
    filename: string,
    cacheControl: string,
  ): Promise<void> {
    const type =
      MIME_TYPES[extname(filename).toLowerCase()] ?? 'application/octet-stream';
    try {
      await this.send(res, UPLOAD_DIR, filename, type, cacheControl);
    } catch {
      throw new NotFoundException('Arquivo não encontrado');
    }
  }

  private send(
    res: Response,
    root: string,
    name: string,
    type: string,
    cacheControl: string,
  ): Promise<void> {
    res.setHeader('Content-Type', type);
    res.setHeader('Cache-Control', cacheControl);
    return new Promise((done, fail) => {
      // Com `root`, a regra de arquivos ocultos vale só para o nome, não para as pastas acima dele.
      res.sendFile(name, { root, dotfiles: 'deny' }, (error) => {
        if (!error) return done();
        // Já enviou parte do arquivo: só resta encerrar, para o cliente não ficar esperando.
        if (res.headersSent) {
          res.destroy();
          return done();
        }
        // A resposta de erro não pode herdar o tipo de imagem nem o cache de um ano.
        res.removeHeader('Content-Type');
        res.removeHeader('Cache-Control');
        fail(error);
      });
    });
  }
}
