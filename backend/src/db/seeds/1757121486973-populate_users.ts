import { User } from 'src/entities/user.entity';
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

        const usersToCreate = [
            { username: 'admin', email: 'admin@example.com', password: 'admin123' },
        ]

        for (const userData of usersToCreate) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = userRepository.create({
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
            });

            await userRepository.save(user);

            console.log(`Usuário '${user.username}' e senha '${user.password}' criado com sucesso.`);
        }
    }
}
