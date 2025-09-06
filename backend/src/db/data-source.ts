import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import envConfig from '../config/config';
import { SeederOptions } from 'typeorm-extension';
import { types } from 'pg';

// OID 1114 = timestamp sem timezone
// Aqui configuramos para devolver string literal, sem converter para UTC
types.setTypeParser(1114, (str) => str);

const config = {
  type: 'postgres',
  host: envConfig().DB_HOST,
  port: Number(envConfig().DB_PORT),
  username: envConfig().DB_USER,
  password: envConfig().DB_PASSWORD,
  database: envConfig().DATABASE,
  entities: ['dist/entities/*{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  synchronize: false,
  seeds: ['dist/db/seeds/**/*{.ts,.js}'],
} as DataSourceOptions & SeederOptions;

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
