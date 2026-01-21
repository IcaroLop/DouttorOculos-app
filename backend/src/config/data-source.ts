import 'reflect-metadata';
import { DataSource } from 'typeorm';
import env from './env';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  synchronize: false, // use migrations in production; keep false for safety
  logging: env.nodeEnv === 'development',
  entities: [User],
  migrations: [],
});
