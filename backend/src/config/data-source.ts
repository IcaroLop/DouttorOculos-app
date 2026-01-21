import 'reflect-metadata';
import { DataSource } from 'typeorm';
import env from './env';
import { User } from '../entities/User';
import { Loja } from '../entities/Loja';
import { Cliente } from '../entities/Cliente';
import { Produto } from '../entities/Produto';
import { Receita } from '../entities/Receita';
import { Venda } from '../entities/Venda';
import { ItemVenda } from '../entities/ItemVenda';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  synchronize: env.nodeEnv === 'development', // Auto-sync only in dev
  logging: env.nodeEnv === 'development',
  entities: [User, Loja, Cliente, Produto, Receita, Venda, ItemVenda],
  migrations: [],
  charset: 'utf8mb4',
});
