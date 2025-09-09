// src/media/media.controller.ts
import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { UPLOAD_DIR } from 'src/config/multer.config';

@ApiTags('Media')
@Controller('api/v1/media')
export class MediaController {
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    // Evita path traversal: resolve dentro de UPLOAD_DIR e verifica prefixo
    const safePath = resolve(UPLOAD_DIR, filename);
    if (!safePath.startsWith(resolve(UPLOAD_DIR))) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    if (!existsSync(safePath)) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    const ext = filename.split('.').pop()?.toLowerCase();
    const mime: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
    };

    res.setHeader('Content-Type', (ext && mime[ext]) || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 ano
    return res.sendFile(safePath);
  }
}
