
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from 'src/modules/users/users.service';
import { getAdminSeedConfig } from 'src/utils/admin-seed-config';

async function bootstrap() {
  const admin = getAdminSeedConfig();
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existingUser = await usersService.findByUsername(admin.username);

    if (!existingUser) {
      await usersService.create(admin);
      console.log(`✅ Usuário "${admin.username}" criado com sucesso.`);
    } else {
      console.log(`ℹ️ Usuário "${admin.username}" já existe`);
    }
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error(`❌ Erro ao criar usuário administrador: ${error.message}`);
  process.exit(1);
});
