
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SESSION_COOKIE } from './auth/session-cookie';
import envConfig from './config/config';

import * as cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import helmet from 'helmet';

// 🔑 Polyfill para garantir que crypto.randomUUID exista
if (!(global as any).crypto) {
  (global as any).crypto = crypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const _logger = new Logger('Bootstrap');

  // A Vercel repassa estes cabeçalhos ao navegador no domínio do site, e o HSTS
  // fica guardado por um ano: sem `includeSubDomains`, ele não alcança outros
  // subdomínios que a organização venha a ter.
  app.use(helmet({ strictTransportSecurity: { includeSubDomains: false } }));

  // O site chama a API pela própria origem, então o CORS fica fechado.
  app.use(cookieParser());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const swaggerEnabled = envConfig().ENABLE_SWAGGER;
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('🌳 Sementes da Amazônia API 🌳')
      .setDescription('🌿 API para o site Sementes da Amazônia 🌿')
      .setVersion('1.0')
      .addCookieAuth(SESSION_COOKIE)
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  const host = 'localhost';
  const port = envConfig().PORT;

  await app.listen(port);
  console.log('\n');
  _logger.debug(`🚀 Application is running on: http://${host}:${port} 🚀`);
  if (swaggerEnabled) {
    _logger.debug(`📃 Swagger docs: http://${host}:${port}/docs 📃`);
  }
  console.log('\n');
}
bootstrap();
