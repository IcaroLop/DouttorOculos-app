# Guia de Inicialização do Projeto GitHub

## 1. Preparação do Repositório

```bash
# Acesse o repositório já criado
cd path/to/DouttorOculos-app

# Inicialize o git (se ainda não estiver)
git init
git remote add origin https://github.com/IcaroLop/DouttorOculos-app.git

# Crie a estrutura base
mkdir -p backend frontend-web docs .github/workflows
```

## 2. Estrutura de Pastas Recomendada

### Backend (Node.js + Express)

```bash
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuração Sequelize/TypeORM
│   │   ├── redis.js             # Configuração Redis
│   │   └── constants.js         # Constantes do app
│   ├── controllers/
│   │   ├── usuarioController.js
│   │   ├── clienteController.js
│   │   ├── produtoController.js
│   │   ├── vendaController.js
│   │   └── receitaController.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Cliente.js
│   │   ├── Produto.js
│   │   ├── Venda.js
│   │   ├── ItemVenda.js
│   │   └── Receita.js
│   ├── routes/
│   │   ├── index.js             # Agregador de rotas
│   │   ├── usuarios.js
│   │   ├── clientes.js
│   │   ├── produtos.js
│   │   ├── vendas.js
│   │   └── receitas.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Joi/Pydantic
│   │   ├── errorHandler.js      # Error handling
│   │   └── audit.js             # Logging
│   ├── services/
│   │   ├── usuarioService.js
│   │   ├── clienteService.js
│   │   ├── vendaService.js
│   │   └── relatorioService.js
│   ├── utils/
│   │   ├── encryptionUtils.js   # Criptografia
│   │   ├── validators.js        # Validadores
│   │   └── helpers.js
│   ├── app.js                   # Express app
│   └── server.js                # Entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env.example
├── .eslintrc.json
├── package.json
├── docker.build                 # Dockerfile
└── README.md
```

### Frontend Web (React + TypeScript)

```bash
frontend-web/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   ├── forms/
│   │   │   ├── ClienteForm.tsx
│   │   │   ├── ProdutoForm.tsx
│   │   │   └── VendaForm.tsx
│   │   ├── tables/
│   │   │   ├── ClientesTable.tsx
│   │   │   ├── ProdutosTable.tsx
│   │   │   └── VendasTable.tsx
│   │   └── charts/
│   │       ├── VendasChart.tsx
│   │       └── EstoqueChart.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Clientes/
│   │   │   ├── ListarClientes.tsx
│   │   │   ├── CriarCliente.tsx
│   │   │   └── DetalheCliente.tsx
│   │   ├── Produtos/
│   │   ├── Vendas/
│   │   ├── Receitas/
│   │   ├── Relatorios/
│   │   └── Login.tsx
│   ├── services/
│   │   ├── api.ts               # Axios instance
│   │   ├── clienteService.ts
│   │   ├── produtoService.ts
│   │   ├── vendaService.ts
│   │   └── authService.ts
│   ├── redux/
│   │   ├── store.ts
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── clienteSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── hooks.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useFetch.ts
│   ├── styles/
│   │   ├── theme.ts             # Material-UI theme
│   │   ├── global.css
│   │   └── variables.css
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── localStorage.ts
│   ├── types/
│   │   ├── index.ts             # Type definitions
│   │   └── api.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── react-app-env.d.ts
│   ├── serviceWorker.ts         # PWA
│   └── manifest.json            # PWA manifest
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── favicon.ico
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   └── offline.html
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
├── .env.example
├── .eslintrc.json
├── tsconfig.json
├── package.json
└── README.md
```

## 3. Arquivos de Configuração

### .gitignore

```bash
# Backend
backend/node_modules/
backend/.env
backend/.env.local
backend/dist/
backend/build/
backend/coverage/

# Frontend
frontend-web/node_modules/
frontend-web/build/
frontend-web/.env.local
frontend-web/coverage/

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Sistema
.DS_Store
.vscode/settings.json
.idea/

# Database
*.db
*.sqlite

# Python
__pycache__/
.venv/
*.pyc
```

### docker-compose.yml (Desenvolvimento)

```yaml
version: '3.9'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: douttoroculos
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      NODE_ENV: development
      DATABASE_URL: mysql://root:root@mysql:3306/douttoroculos
      REDIS_URL: redis://redis:6379
    depends_on:
      - mysql
      - redis
    volumes:
      - ./backend/src:/app/src

  frontend:
    build:
      context: ./frontend-web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://localhost:3001/api/v1
    depends_on:
      - backend
    volumes:
      - ./frontend-web/src:/app/src

volumes:
  mysql_data:
```

## 4. Package.json Base (Backend)

```json
{
  "name": "douttoroculos-backend",
  "version": "1.0.0",
  "description": "Backend API - DouttorOculos",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:e2e": "jest --config jest.e2e.config.js",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix"
  },
  "dependencies": {
    "express": "^4.18.2",
    "sequelize": "^6.35.2",
    "mysql2": "^3.6.5",
    "redis": "^4.6.11",
    "jsonwebtoken": "^9.1.2",
    "bcryptjs": "^2.4.3",
    "joi": "^17.11.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "winston": "^3.11.0",
    "axios": "^1.6.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3",
    "eslint": "^8.54.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## 5. Primeiro Commit

```bash
# Stage dos documentos
git add docs/ .github/ README.md

# Primeiro commit
git commit -m "docs: add project documentation and structure"

# Push para repositório
git branch -M main
git push -u origin main
```

## 6. Estrutura de Branches Recomendada

```
main                    # Production
├── develop            # Staging/Development
│   ├── feature/auth
│   ├── feature/clientes
│   ├── feature/vendas
│   ├── feature/relatorios
│   ├── bugfix/...
│   └── hotfix/...
```

## 7. GitHub Actions Workflow Base

Criar `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm install && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend-web && npm install && npm test

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd backend && npm run lint
      - run: cd frontend-web && npm run lint
```

---

**Status**: Pronto para iniciar o desenvolvimento! 🚀
