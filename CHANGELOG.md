# Changelog - DouttorOculos

## [Unreleased] - 2026-01-21

### ✅ Implementado (Backend)

#### Entidades TypeORM (7 entidades)
- Criadas entidades: User, Loja, Cliente, Produto, Receita, Venda, ItemVenda
- Configurado TypeORM com MySQL (synchronize: true em dev)
- Soft delete implementado em todas entidades (campo `ativo`)
- Relacionamentos: OneToMany, ManyToOne configurados

#### Services (5 services)
- **authService.ts**: Login com JWT (access + refresh), seed de admin automático
- **clienteService.ts**: CRUD completo, validação CPF único, paginação
- **produtoService.ts**: CRUD, gestão de estoque, alertas de estoque baixo
- **receitaService.ts**: CRUD, validação de validade (1 ano), alertas de vencimento
- **vendaService.ts**: CRUD, auto-decremento de estoque, cálculo de ticket médio

#### Controllers & Routes (24 endpoints)
- `/api/v1/auth/*`: Login, refresh token
- `/api/v1/clientes/*`: 5 endpoints (POST, GET, GET/:id, PUT/:id, DELETE/:id)
- `/api/v1/produtos/*`: 6 endpoints (+ /baixo-estoque)
- `/api/v1/receitas/*`: 7 endpoints (+ /validade, /proximasAoVencimento)
- `/api/v1/vendas/*`: 6 endpoints (+ /ticket-medio, /cliente/:clienteId)

#### Validação & Middleware
- Joi schemas para todos endpoints em `middleware/schemas.ts`
- Middleware `validateBody()` aplicado em todas rotas
- Error handler centralizado
- CORS configurado (dev e prod)
- Rate limiting (100 req/min por IP)

#### Configuração
- TypeScript configurado (strict mode)
- Bcrypt para senhas (12 rounds)
- JWT duplo (access 15min, refresh 7d)
- Multi-tenancy via header `x-portal` e coluna `lojaId`
- Env vars estruturadas em `config/env.ts`

### ✅ Implementado (Frontend)

#### Estrutura Base
- React 18 + TypeScript + Vite
- Redux Toolkit para state management
- Material-UI v5 para componentes
- React Router para navegação
- Axios com interceptors (auto-refresh, auto x-portal)

#### Redux Slices (4 slices)
- **authSlice**: accessToken, refreshToken, portal, user (persistência em localStorage)
- **clienteSlice**: clientes[], pagination, filtering, search
- **produtoSlice**: produtos[], categoria filter, estoque alerts
- **vendaSlice**: vendas[], itensVenda[], ticketMedio

#### Services (6 API clients)
- **api.ts**: Cliente Axios base com interceptors
- **auth.ts**: Login, logout, refresh
- **clienteService.ts**: CRUD tipado
- **produtoService.ts**: CRUD + obterComEstoqueBaixo()
- **receitaService.ts**: CRUD + verificarValidade()
- **vendaService.ts**: CRUD + obterTicketMedio()

#### Pages (5 páginas)
- **Login.tsx**: Formulário de autenticação (portal + username + password)
- **Dashboard.tsx**: Página inicial protegida, exibe usuário logado
- **ListarClientes.tsx**: Tabela Material-UI + busca em tempo real
- **ListarProdutos.tsx**: Tabela + filtros de categoria + alertas de estoque baixo
- **ListarVendas.tsx**: Tabela + filtro de status + chips coloridos

#### Componentes
- **ProtectedRoute.tsx**: HOC para rotas autenticadas
- **useRedux.ts**: Typed dispatch e selector hooks

### ✅ Build & Deploy
- Backend compilando sem erros TypeScript
- Frontend compilando sem erros TypeScript
- Docker Compose configurado (MySQL + Backend + Frontend)
- PWA configurado (manifest.json, service worker)

### ✅ Documentação
- **STATUS_IMPLEMENTACAO.md**: Status detalhado do projeto
- **QUICK_REFERENCE.md**: Guia rápido para IAs
- **API_ENDPOINTS.md**: Documentação completa da API
- **.github/copilot-instructions.md**: Instruções para IAs de codificação
- **README.md**: Atualizado com estrutura de arquivos e status
- **.env.example**: Template completo de variáveis de ambiente

---

## ⚠️ Pendências Identificadas

### Alta Prioridade
- [ ] Portal → LojaId mapping (atual: hardcoded `lojaId = 1`)
- [ ] Formulários de criação/edição (FormCliente, FormProduto, FormReceita, FormVenda)
- [ ] Páginas de detalhe (DetalheCliente, DetalheProduto, DetalheVenda)

### Média Prioridade
- [ ] Guards de autorização por cargo (JWT tem `cargo`, mas sem validação)
- [ ] Dashboard analítico com gráficos
- [ ] Sistema de pedidos sob medida

### Baixa Prioridade
- [ ] Relatórios gerenciais (PDF/Excel export)
- [ ] Integrações (WhatsApp, NF-e, Gateway Pagamento)
- [ ] PWA offline support
- [ ] Testes automatizados (Jest, Vitest, Playwright)

---

## 🔧 Ajustes Técnicos Realizados

### Backend
- Instalado `@types/cors` para TypeScript
- Removido imports não utilizados (`portal`, `req`, `next`)
- Corrigido tipo `SignOptions` para `jwt.sign()` com casting `as any`
- Removido import não utilizado `DataSource` de receitaService

### Frontend
- Adicionado `noEmit: true` em tsconfig.json
- Criado `vite-env.d.ts` para tipos de `import.meta.env`
- Removido imports não utilizados de React
- Corrigido imports para usar aliases `@/` em vez de paths relativos
- Adicionado tipos explícitos em map/filter functions
- Corrigido assignment de headers em api.ts interceptor

---

## 📦 Commits Sugeridos

```bash
# Backend
git add backend/
git commit -m "feat(backend): implement 7 TypeORM entities with multi-tenancy"
git commit -m "feat(backend): add 5 services with full CRUD and business logic"
git commit -m "feat(backend): create 24 API endpoints with Joi validation"
git commit -m "feat(backend): configure JWT auth with access + refresh tokens"
git commit -m "fix(backend): resolve TypeScript compilation errors"

# Frontend
git add frontend-web/
git commit -m "feat(frontend): setup React 18 + TypeScript + Redux Toolkit"
git commit -m "feat(frontend): create 4 Redux slices with typed selectors"
git commit -m "feat(frontend): implement 6 API service clients"
git commit -m "feat(frontend): add 5 pages (Login, Dashboard, Listar*)"
git commit -m "fix(frontend): resolve TypeScript compilation errors"

# Documentação
git add *.md .github/
git commit -m "docs: create comprehensive documentation (STATUS, QUICK_REF, API_ENDPOINTS)"
git commit -m "docs: update README with project status and structure"
git commit -m "docs: add AI coding instructions and business rules"

# Config
git add .env.example docker-compose.yml
git commit -m "chore: update env template and docker compose"
```

---

**Data:** 21 de Janeiro de 2026  
**Responsável:** GitHub Copilot + IcaroLop  
**Status:** ✅ Backend e Frontend compilando sem erros
