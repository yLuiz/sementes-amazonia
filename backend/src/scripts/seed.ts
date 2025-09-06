
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from 'src/modules/users/users.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    // Verificar se o usuário já existe
    const existingUser = await usersService.findByUsername('admin');

    if (!existingUser) {
      // Criar usuário padrão
      await usersService.create({
        email: 'admin@example.com',
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅ Usuário padrão criado com sucesso!');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      console.log('ℹ️ Usuário padrão já existe');
    }
  } catch (error) {
    console.error('❌ Erro ao criar usuário padrão:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
