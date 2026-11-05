// src/config/multer.config.ts
import { StorageEngine } from 'multer';
import { extname, join } from 'path';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import envConfig from './config';

// Use o volume em produção (ex.: /data/uploads) ou ./uploads em dev
export const UPLOAD_DIR = envConfig().UPLOAD_DIR;

// Garante que a pasta existe
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * Igual ao `diskStorage`, exceto no envio interrompido: o multer só remove arquivos
 * completos, e o `diskStorage` deixaria o pedaço gravado no disco com o arquivo aberto.
 */
const uploadStorage: StorageEngine = {
  _handleFile(req, file, cb) {
    const filename = `${uuidv4()}${extname(file.originalname).toLowerCase()}`;
    const path = join(UPLOAD_DIR, filename);
    const output = createWriteStream(path);

    const discard = () => {
      output.once('close', () => unlink(path, () => undefined));
      output.destroy();
    };
    const onConnectionClosed = () => {
      if (!req.complete) discard();
    };

    file.stream.once('error', discard);
    req.once('close', onConnectionClosed);
    file.stream.pipe(output);

    output.once('error', (err) => {
      req.off('close', onConnectionClosed);
      cb(err);
    });
    output.once('finish', () => {
      req.off('close', onConnectionClosed);
      cb(null, { destination: UPLOAD_DIR, filename, path, size: output.bytesWritten });
    });
  },
  _removeFile(_req, file, cb) {
    unlink(file.path, cb);
  },
};

export const multerConfig = {
  storage: uploadStorage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestException('Formato de arquivo inválido. Apenas JPEG, JPG, PNG e WEBP são permitidos.'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
};
