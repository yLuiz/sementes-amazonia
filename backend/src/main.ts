
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import envConfig from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const _logger = new Logger('Bootstrap');
  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('🌳 Sementes da Amazônia API 🌳')
    .setDescription('🌿 API para o site Sementes da Amazônia 🌿')
    .setVersion('1.0')
    .addBearerAuth() // Para endpoints protegidos com JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const host = 'localhost';
  const port = envConfig().PORT;

  await app.listen(port);
  console.log('\n');
  _logger.debug(`🚀 Application is running on: http://${host}:${port} 🚀`);
  _logger.debug(`📃 Swagger docs: http://${host}:${port}/docs 📃`);
  console.log('\n');
}
bootstrap();
