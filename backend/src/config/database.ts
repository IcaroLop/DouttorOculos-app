import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bolaovip',
  synchronize: process.env.NODE_ENV === 'development', // Apenas em dev
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/models/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  charset: 'utf8mb4',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    throw error;
  }
};
