// src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { existsSync, mkdirSync } from 'fs';
import envConfig from './config';

// Use o volume em produção (ex.: /data/uploads) ou ./uploads em dev
export const UPLOAD_DIR = envConfig().UPLOAD_DIR;

// Garante que a pasta existe
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const multerConfig = {
  storage: diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {

      console.log('File path:', UPLOAD_DIR);

      const uniqueSuffix = uuidv4();
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestException('Formato de arquivo inválido. Apenas JPEG, JPG, PNG e WEBP são permitidos.'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};
