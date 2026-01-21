# Copilot Instructions for DouttorOculos

**Status Atual:** ✅ Backend e Frontend compilando sem erros. Ver `STATUS_IMPLEMENTACAO.md` para detalhes completos.

## Architecture Overview

**DouttorOculos** is an optical store management system with a **multi-tenant architecture**, separating frontend (React 18 + TypeScript), backend (Node.js + Express + TypeORM), and a MySQL database. Key structural decisions:

- **Multi-tenancy**: `portal` identifies tenant; all data filtered by tenant. Users belong to portals, which map to `lojas` (store branches)
- **JWT Authentication**: 15min access tokens + 7day refresh tokens; both returned on login, stored in Redux
- **Frontend State**: Redux Toolkit + localStorage persistence for auth state
- **Portal Header**: Frontend sends `x-portal` header on all API requests
- **Admin Seeding**: Default admin (`admin`/`123456`) auto-created from `.env` on first startup

## ✅ Implementações Concluídas (Jan 2026)

### Entidades TypeORM (7 total)
Todas sincronizadas com MySQL via `synchronize: true` em desenvolvimento:
- ✅ **User** - Autenticação, cargos (gerente|vendedor|otico|atendente)
- ✅ **Loja** - Multi-tenant base
- ✅ **Cliente** - CPF único, soft delete
- ✅ **Produto** - SKU único, categorias (armacao|lente|solucao|acessorio), estoque
- ✅ **Receita** - Prescrições oftalmológicas (OD/OE), validade 1 ano
- ✅ **Venda** - Status workflow, pagamentos múltiplos
- ✅ **ItemVenda** - Line items de vendas

### Services Backend (5 total)
- ✅ **authService** - Login, JWT, seed admin
- ✅ **clienteService** - CRUD + validação CPF único
- ✅ **produtoService** - CRUD + gestão estoque + alertas estoque baixo
- ✅ **receitaService** - CRUD + validação validade + alertas vencimento
- ✅ **vendaService** - CRUD + auto-decremento estoque + ticket médio

### Controllers & Routes (5 módulos)
Todos com validação Joi via middleware `validateBody()`:
- ✅ `/api/v1/auth/*` - Login, refresh token
- ✅ `/api/v1/clientes/*` - CRUD completo (5 endpoints)
- ✅ `/api/v1/produtos/*` - CRUD + baixo-estoque (6 endpoints)
- ✅ `/api/v1/receitas/*` - CRUD + validade + vencimento (7 endpoints)
- ✅ `/api/v1/vendas/*` - CRUD + ticket-medio + por-cliente (6 endpoints)

### Frontend - Redux Slices (4 total)
- ✅ **authSlice** - accessToken, refreshToken, portal, user
- ✅ **clienteSlice** - clientes[], pagination, filtering
- ✅ **produtoSlice** - produtos[], categoria filter
- ✅ **vendaSlice** - vendas[], itensVenda[], ticketMedio

### Frontend - Pages (5 total)
- ✅ **Login** - Autenticação com portal + username + password
- ✅ **Dashboard** - Página inicial protegida
- ✅ **ListarClientes** - Tabela + busca em tempo real
- ✅ **ListarProdutos** - Tabela + filtro categoria + alerta estoque
- ✅ **ListarVendas** - Tabela + filtro status + chips coloridos

### Frontend - Services (6 total)
- ✅ **api.ts** - Axios client com interceptors (auto-refresh, x-portal header)
- ✅ **auth.ts** - Login/logout/refresh
- ✅ **clienteService.ts** - CRUD tipado
- ✅ **produtoService.ts** - CRUD + estoque baixo
- ✅ **receitaService.ts** - CRUD + validade
- ✅ **vendaService.ts** - CRUD + analytics

## ⚠️ Pendências Críticas

### 1. Portal → LojaId Mapping (ALTA PRIORIDADE)
**Problema:** Todos controllers usam `lojaId = 1` hardcoded.  
**Solução necessária:**
```typescript
// Criar em backend/src/services/lojaService.ts
export async function getLojaIdFromPortal(portal: string): Promise<number> {
  const loja = await AppDataSource.getRepository(Loja).findOne({ where: { portal } });
  if (!loja) throw new Error('Portal inválido');
  return loja.id;
}

// Usar em controllers:
const portal = req.headers['x-portal'] as string;
const lojaId = await getLojaIdFromPortal(portal);
```

### 2. Guards de Autorização (MÉDIA PRIORIDADE)
**Problema:** JWT contém `cargo` mas nenhuma rota valida permissões.  
**Solução necessária:**
```typescript
// Criar em backend/src/middleware/auth.ts
export const requireRole = (roles: string[]) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, env.auth.jwtSecret);
    if (!roles.includes(decoded.cargo)) {
      return res.status(403).json({ message: 'Sem permissão' });
    }
    req.user = decoded;
    next();
  };
};

// Aplicar em routes:
router.post('/receitas', requireRole(['otico', 'gerente']), validateBody(createReceitaSchema), createReceita);
```

### 3. Formulários de Criação/Edição (ALTA PRIORIDADE UX)
**Faltam componentes:**
- [ ] FormCliente.tsx
- [ ] FormProduto.tsx
- [ ] FormReceita.tsx
- [ ] FormVenda.tsx (com carrinho de itens)

**Padrão recomendado:**
```typescript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
  nome: yup.string().min(3).required(),
  cpf: yup.string().matches(/^\d{11}$/).required(),
});

export function FormCliente({ clienteId }: { clienteId?: number }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  
  const onSubmit = async (data) => {
    if (clienteId) {
      await clienteService.atualizar(clienteId, data);
    } else {
      await clienteService.criar(data);
    }
  };
  
  return <form onSubmit={handleSubmit(onSubmit)}>...</form>;
}
```

## Development Commands

```bash
# Backend: Development with hot reload
cd backend && npm run dev

# Frontend: Vite dev server
cd frontend-web && npm run dev

# Both w/ Docker: docker-compose up

# Build: Backend (tsc), Frontend (tsc + vite build)
cd backend && npm run build
cd frontend-web && npm run build

# Tests: Jest (backend), Vitest (frontend)
npm test                    # backend/
npm test:ui                 # frontend-web/ (interactive)

# Linting/Format
npm run lint               # Check
npm run lint:fix           # Fix
npm run format             # Prettier
```

## Code Structure & Patterns

### Backend (`backend/src/`)
- **controllers/** → Request handlers (thin layer, delegate to services)
- **services/** → Business logic, DB queries (e.g., `authService.ts` with `loginService()`, `ensureAdminUser()`)
- **middleware/** → `validateBody(schema)` (Joi validation), `errorHandler`, auth middleware
- **entities/** → TypeORM entities (e.g., `User.ts`)
- **config/** → Database (`database.ts`), TypeORM (`data-source.ts`), env loading (`env.ts`)
- **routes/** → Express route groups (e.g., `auth.routes.ts`)

**Pattern Example** (auth flow):
```typescript
// routes/auth.routes.ts
router.post('/login', validateBody(loginSchema), loginController);

// controllers/authController.ts
export async function loginController(req, res, next) {
  try {
    const result = await loginService(req.body);
    return res.json(result);
  } catch (err) {
    return next(err);  // Caught by errorHandler
  }
}

// services/authService.ts
export async function loginService(input: LoginInput) {
  // Queries via userRepo(), JWT generation, returns tokens + user
}
```

### Frontend (`frontend-web/src/`)
- **pages/** → Page components (Login, Dashboard)
- **components/** → Reusable UI (ProtectedRoute enforces auth)
- **redux/slices/** → `authSlice` manages accessToken, refreshToken, portal, user; persists to localStorage
- **services/** → API client (`api.ts` with Axios interceptors), auth helpers (`auth.ts`)
- **types/** → TypeScript interfaces (e.g., `auth.ts` with `AuthUser`, `AuthState`)

**API Interceptor Pattern**: Axios request interceptor injects `x-portal` header + `Authorization: Bearer {token}`; response interceptor auto-refreshes token on 401.

## Critical Integration Points

### Portal & Multi-Tenancy
- Login endpoint requires `{ portal, username, password }` in body
- Backend stores `portal` in JWT claims; frontend caches in Redux + localStorage
- All API calls must include `x-portal` header; backend filters queries by tenant
- **Example**: User `admin` on portal `default` is separate from `admin` on portal `store-2`

### Database (`src/config/database.ts`)
- TypeORM with MySQL 8.0, UTF-8MB4, charset `utf8mb4_unicode_ci`
- Synchronize enabled only in dev (`NODE_ENV === 'development'`)
- Connection pool: built-in to TypeORM driver
- Entity `User` maps to `usuarios` table

### Authentication Flow
1. POST `/api/v1/auth/login` with `{portal, username, password}`
2. Backend validates, hashes check with bcrypt (12 rounds), returns `{accessToken, refreshToken, user}`
3. Frontend stores in Redux + localStorage
4. On 401, frontend calls `POST /api/v1/auth/refresh` with refreshToken
5. Auto-logout if refresh fails

## Security & LGPD Compliance

- **Password Hashing**: bcrypt, 12 rounds (configured in `env.ts`)
- **Rate Limiting**: 100 req/min per IP (express-rate-limit in `server.ts`)
- **CORS**: Manually configured (before Helmet); allowed origins from `.env` split by comma
- **Helmet**: Headers for XSS, clickjacking protection
- **Soft Deletes**: Flag `ativo = FALSE` instead of DELETE (not yet enforced in queries)
- **Audit Logs**: Log sensitive operations (logins, sales, stock changes)

## Domain-Specific Logic (from RegrasNegocio.md)

- **Receitas (Prescriptions)**: Fields OD/OE (each with esfera, cilindro, eixo), DNP, adicao, validade 1 year
- **Estoque (Stock)**: Categories: armacao, lente, solucao, acessorio; SKU unique per tenant; alert < 5 units
- **Vendas (Sales)**: Methods (dinheiro, credito, debito, pix); status (pendente → concluida/cancelada); manager discount limit 20%
- **Clientes (Clients)**: CPF (unique), phone (required), email (optional); soft-deleted when inactive

## Common Workflows

**Adding an API Endpoint**:
1. Define Joi schema in route file
2. Create controller calling service
3. Implement service logic (queries via repo)
4. Wire route in `routes/index.ts`
5. Add to frontend `api.ts` if needed

**Frontend State Update**:
1. Create action in Redux slice
2. Dispatch from component via `useAppDispatch()`
3. Selector persists to localStorage via `persistState()`

## Key Files & References

- [Infraestrutura.md](../Infraestrutura.md) → Full architecture, deployment, costs
- [RegrasNegocio.md](../RegrasNegocio.md) → Business rules, domain validation
- `.env.example` → Template for DB_HOST, JWT_SECRET, ADMIN_PORTAL, etc.
- `docker-compose.yml` → Local dev: MySQL 3306, Redis 6379, Backend 3000, Frontend 5173
- `backend/src/config/env.ts` → All env vars structured; mirrors .env layout
