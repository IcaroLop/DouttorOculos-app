import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { initializeDatabase } from './config/database';

// Carregar variáveis de ambiente
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me';
const ACCESS_EXPIRES_IN = process.env.ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || '7d';

const ADMIN_PORTAL = process.env.ADMIN_PORTAL || 'default';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123456';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@douttoroculos.com';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173,http://192.168.56.127:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

console.log('🔐 CORS Allowed Origins:', allowedOrigins);

// CORS manual (antes de helmet) - com tratamento de preflight
app.use((req, res, next) => {
  const origin = req.headers.origin as string | undefined;
  
  // Log para debug (remover em produção)
  if (process.env.NODE_ENV === 'development') {
    console.log(`📥 Request origin: "${origin}", in allowlist: ${origin ? allowedOrigins.includes(origin) : 'N/A'}`);
  }
  
  // Aceitar QUALQUER origem em desenvolvimento (seguro apenas para dev!)
  // Em produção, remover este if
  if (process.env.NODE_ENV === 'development') {
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  } else {
    // Produção: validar contra allowlist
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS,HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-portal');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  return next();
});

// Middlewares de segurança
app.use(helmet({ crossOriginResourcePolicy: false }));

// Middlewares de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Rota raiz
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'DouttorOculos API',
    version: '1.0.0',
    documentation: '/api/v1/docs',
  });
});

// Auth minimal (seed admin)
type TokenPayload = JwtPayload & { type: 'access' | 'refresh'; portal: string; role: string; sub: number };

const buildUser = (portal: string) => ({
  id: 1,
  nome: ADMIN_NAME,
  email: ADMIN_EMAIL,
  cargo: 'admin',
  portal,
});

const signAccess = (payload: Omit<TokenPayload, 'type'>) => {
  const options: SignOptions = { expiresIn: ACCESS_EXPIRES_IN as any };
  return jwt.sign({ ...payload, type: 'access' }, JWT_SECRET, options);
};

const signRefresh = (payload: Omit<TokenPayload, 'type'>) => {
  const options: SignOptions = { expiresIn: REFRESH_EXPIRES_IN as any };
  return jwt.sign({ ...payload, type: 'refresh' }, JWT_SECRET, options);
};

app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { portal, username, password } = req.body as { portal?: string; username?: string; password?: string };

  if (!portal || !username || !password) {
    return res.status(400).json({ message: 'Portal, usuário e senha são obrigatórios.' });
  }

  if (portal !== ADMIN_PORTAL || username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  const user = buildUser(portal);
  const accessToken = signAccess({ sub: user.id, portal, role: user.cargo });
  const refreshToken = signRefresh({ sub: user.id, portal, role: user.cargo });

  return res.json({ accessToken, refreshToken, user: { id: user.id, nome: user.nome, email: user.email, cargo: user.cargo } });
});

app.post('/api/v1/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken, portal } = req.body as { refreshToken?: string; portal?: string };

  if (!refreshToken || !portal) {
    return res.status(400).json({ message: 'refreshToken e portal são obrigatórios.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as TokenPayload;
    if (decoded.type !== 'refresh' || decoded.portal !== portal) {
      return res.status(401).json({ message: 'Refresh token inválido.' });
    }

    const user = buildUser(portal);
    const newAccess = signAccess({ sub: user.id, portal, role: user.cargo });
    const newRefresh = signRefresh({ sub: user.id, portal, role: user.cargo });

    return res.json({ accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) {
    return res.status(401).json({ message: 'Refresh token inválido ou expirado.' });
  }
});

// Middleware de erro 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path,
  });
});

// Middleware de tratamento de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado',
  });
});

// Inicializar aplicação
const startServer = async () => {
  try {
    // Inicializar conexão com banco de dados
    await initializeDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Erro ao iniciar a aplicação', error);
    process.exit(1);
  }
};

startServer();

export default app;
