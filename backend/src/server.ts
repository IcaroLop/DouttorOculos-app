import app from './app';
import { AppDataSource } from './config/data-source';
import env from './config/env';
import { ensureAdminUser } from './services/authService';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('📦 Data source inicializado');

    await ensureAdminUser();
    console.log('👤 Usuário admin garantido');

    app.listen(env.port, () => {
      console.log(`🚀 API rodando na porta ${env.port}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar a aplicação', err);
    process.exit(1);
  }
}

bootstrap();
