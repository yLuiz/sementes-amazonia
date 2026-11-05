import { User } from 'src/entities/user.entity';
import { getAdminSeedConfig } from 'src/utils/admin-seed-config';
import { getCurrentTimeString } from 'src/utils/getCurrentTimeString';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcryptjs';

export class PopulateUsers1757121486973 implements Seeder {
    track = false;

    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager
    ): Promise<any> {
        const userRepository = dataSource.getRepository(User);
        const admin = getAdminSeedConfig();

        const existingUser = await userRepository.findOne({ where: { username: admin.username } });
        if (existingUser) {
            console.log(`ℹ️ Usuário "${admin.username}" já existe. Pulando...`);
            return;
        }

        await userRepository.save(userRepository.create({
            username: admin.username,
            email: admin.email,
            password: await bcrypt.hash(admin.password, 10),
            created_at: getCurrentTimeString(),
            updated_at: getCurrentTimeString(),
        }));

        console.log(`✅ Usuário "${admin.username}" criado com sucesso.`);
    }
}
