# 🚀 Guia de Setup - DouttorOculos

Bem-vindo ao **DouttorOculos**! Este guia fornece instruções passo a passo para configurar o ambiente de desenvolvimento.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js v18+** - [Baixar](https://nodejs.org/)
- **npm v9+** ou **yarn**
- **Docker & Docker Compose** (recomendado para desenvolvimento) - [Baixar](https://www.docker.com/products/docker-desktop)
- **Git** - [Baixar](https://git-scm.com/)
- **Visual Studio Code** (opcional, mas recomendado) - [Baixar](https://code.visualstudio.com/)

### Extensões VS Code Recomendadas
```
ES7+ React/Redux/React-Native snippets
Thunder Client (ou Postman)
MySQL
Prettier - Code formatter
ESLint
```

---

## 🔧 Instalação Rápida (Com Docker)

### 1. Clone o repositório
```bash
git clone https://github.com/IcaroLop/DouttorOculos-app.git
cd DouttorOculos-app
```

### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env conforme necessário (no desenvolvimento local, pode deixar os padrões)
```

### 3. Inicie os containers
```bash
docker-compose up -d
```

Este comando irá:
- ✅ Criar e iniciar container MySQL (porta 3306)
- ✅ Criar e iniciar container Redis (porta 6379)
- ✅ Criar e iniciar container Backend (porta 3000)
- ✅ Criar e iniciar container Frontend (porta 5173)

### 4. Aguarde a inicialização
```bash
# Verifique o status dos containers
docker-compose ps

# Veja os logs
docker-compose logs -f backend
```

### 5. Acesse a aplicação
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Database**: localhost:3306 (via client MySQL)
- **Redis**: localhost:6379

---

## 🛠️ Instalação Manual (Sem Docker)

### 1. Clone o repositório
```bash
git clone https://github.com/IcaroLop/DouttorOculos-app.git
cd DouttorOculos-app
```

### 2. Configure MySQL localmente
```bash
# Instale MySQL Community Server
# https://dev.mysql.com/downloads/mysql/

# Crie o banco de dados
mysql -u root -p
> CREATE DATABASE douttoroculos CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> EXIT;

# Execute o script de setup do banco
python setup_database.py
```

### 3. Configure Redis (opcional mas recomendado)
```bash
# Windows: Download e instale https://github.com/microsoftarchive/redis/releases
# macOS: brew install redis
# Linux: sudo apt-get install redis-server

# Inicie o Redis
redis-server
```

### 4. Instale dependências do Backend
```bash
cd backend
npm install
```

### 5. Configure Backend .env
```bash
# Crie o arquivo .env baseado em .env.example
cp ../.env.example .env

# Edite com suas credenciais locais
# DB_HOST=localhost (não saveincloud)
# DB_PASSWORD=sua_senha_mysql
```

### 6. Inicie o Backend
```bash
npm run dev
# O backend estará rodando em http://localhost:3000
```

### 7. Instale dependências do Frontend (novo terminal)
```bash
cd frontend-web
npm install
```

### 8. Inicie o Frontend
```bash
npm run dev
# O frontend estará rodando em http://localhost:5173
```

---

## 📁 Estrutura do Projeto

```
DouttorOculos-app/
├── backend/                          # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/              # Lógica de requisições HTTP
│   │   ├── models/                   # Entidades TypeORM
│   │   ├── routes/                   # Definição de rotas
│   │   ├── middleware/               # Middlewares (auth, validação, etc)
│   │   ├── services/                 # Lógica de negócio
│   │   ├── config/                   # Configurações (DB, Redis, etc)
│   │   ├── tests/                    # Testes unitários/integração
│   │   └── server.ts                 # Arquivo principal
│   ├── package.json                  # Dependências Node.js
│   ├── tsconfig.json                 # Configuração TypeScript
│   ├── .eslintrc.json                # ESLint
│   ├── .prettierrc                   # Prettier
│   └── Dockerfile                    # Build para container
│
├── frontend-web/                     # Frontend React 18+
│   ├── src/
│   │   ├── components/               # Componentes React
│   │   ├── pages/                    # Páginas/rotas
│   │   ├── services/                 # Chamadas à API
│   │   ├── redux/slices/             # Redux store
│   │   ├── hooks/                    # Custom React hooks
│   │   ├── styles/                   # Estilos Material-UI
│   │   ├── types/                    # Tipos TypeScript
│   │   └── App.tsx                   # Componente raiz
│   ├── public/                       # Assets estáticos
│   ├── package.json                  # Dependências Node.js
│   ├── tsconfig.json                 # Configuração TypeScript
│   ├── vite.config.ts                # Configuração Vite
│   ├── .eslintrc.json                # ESLint
│   ├── .prettierrc                   # Prettier
│   └── Dockerfile                    # Build para container
│
├── .env.example                      # Variáveis de ambiente modelo
├── docker-compose.yml                # Configuração Docker
├── .gitignore                        # Arquivos ignorados pelo Git
├── README.md                         # Documentação principal
├── SETUP_REPOSITORIO.md              # Estrutura de pastas
├── Infraestrutura.md                 # Arquitetura e deployment
├── RegrasNegocio.md                  # Regras de negócio
├── .github/copilot-instructions.md   # Instruções para IA
├── setup_database.py                 # Script de setup do banco
├── mysql_ssh_client.py               # Cliente SSH para MySQL
└── conectar-mysql.ps1                # Script PowerShell
```

---

## 🗄️ Banco de Dados

### Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| `lojas` | Cadastro de lojas/filiais |
| `usuarios` | Usuários com roles (gerente, vendedor, ótico, atendente) |
| `clientes` | Cadastro de pacientes/clientes |
| `produtos` | Armações, lentes, soluções, acessórios |
| `vendas` | Transações de vendas |
| `itens_venda` | Itens de cada venda |
| `receitas` | Prescrições oftalmológicas |

### Acessar o Banco de Dados

**Com Docker:**
```bash
docker exec -it douttoroculos-mysql mysql -u root -p douttoroculos
```

**Localmente:**
```bash
mysql -u root -p douttoroculos
```

**Produção (SaveInCloud):**
```bash
python mysql_ssh_client.py
```

---

## 🔐 Autenticação e Segurança

### JWT (JSON Web Tokens)
- Tokens expiram em **15 minutos**
- Refresh tokens duram **7 dias**
- Use `Bearer <token>` no header `Authorization`

### Exemplo de Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@example.com","password":"senha123"}'
```

Resposta:
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "usuario@example.com",
    "cargo": "vendedor"
  }
}
```

---

## 📦 Dependências Principais

### Backend
- **express** - Framework web
- **typeorm** - ORM para MySQL
- **jsonwebtoken** - Autenticação JWT
- **bcryptjs** - Hash de senhas
- **redis** - Cache distribuído
- **joi** - Validação de dados
- **winston** - Logging

### Frontend
- **react 18** - UI library
- **react-router-dom** - Roteamento
- **@mui/material** - Componentes UI
- **@reduxjs/toolkit** - State management
- **axios** - Cliente HTTP
- **react-hook-form** - Formulários
- **vite** - Build tool

---

## 🧪 Testes

### Backend
```bash
cd backend
npm run test              # Executar testes
npm run test:watch       # Modo watch
npm run test:coverage    # Cobertura de testes
```

### Frontend
```bash
cd frontend-web
npm run test             # Executar testes
npm run test:ui          # Interface gráfica
```

---

## 🎯 Comandos Úteis

### Backend
```bash
npm run dev              # Inicia em modo desenvolvimento
npm run build            # Compila TypeScript
npm run start            # Inicia produção
npm run lint             # ESLint
npm run lint:fix         # Corrige problemas ESLint
npm run format           # Formata com Prettier
```

### Frontend
```bash
npm run dev              # Inicia Vite dev server
npm run build            # Build de produção
npm run preview          # Visualiza build
npm run lint             # ESLint
npm run lint:fix         # Corrige problemas
npm run format           # Formata com Prettier
npm run type-check       # Verifica tipos TypeScript
```

### Docker
```bash
docker-compose up -d              # Inicia tudo em background
docker-compose down               # Para e remove containers
docker-compose logs -f backend    # Vê logs do backend
docker-compose ps                 # Status dos containers
docker-compose build --no-cache   # Rebuilda imagens
```

---

## 🌐 Conexão com Produção (SaveInCloud)

Para acessar o banco de dados em produção:

```bash
# Via Python (recomendado)
python mysql_ssh_client.py

# Via SSH manual
ssh -i ~/.ssh/id_rsa_douttoroculos 8187@gate.paas.saveincloud.net.br -p 3022
```

**Credenciais:**
- Host: `bolaovip-cs-backend.sp1.br.saveincloud.net.br`
- Usuário: `root`
- Banco: `bolaovip`
- Versão MySQL: `8.0.44`

---

## 📊 Variáveis de Ambiente (.env)

Veja `.env.example` para todas as opções. Principais:

```bash
# Desenvolvimento
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PASSWORD=rootpassword

# Produção
NODE_ENV=production
DB_HOST=bolaovip-cs-backend.sp1.br.saveincloud.net.br
# ... outras variáveis
```

---

## 🐛 Troubleshooting

### Erro: "Port 3000 already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Mate o processo
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Erro: "Cannot connect to MySQL"
```bash
# Verifique se MySQL está rodando
docker-compose ps

# Reinicie MySQL
docker-compose restart mysql

# Verifique conexão
docker exec douttoroculos-mysql mysql -u root -p -e "SHOW DATABASES;"
```

### Erro: "Module not found"
```bash
# Reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "TypeScript compilation error"
```bash
# Verifique tipos
npm run type-check

# Recompile
npm run build
```

---

## 📚 Documentação Completa

- **[README.md](README.md)** - Visão geral do projeto
- **[Infraestrutura.md](Infraestrutura.md)** - Arquitetura, deploy, segurança
- **[RegrasNegocio.md](RegrasNegocio.md)** - Regras de negócio detalhadas
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Instruções para IA

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça commit: `git commit -m "feat: descrição da mudança"`
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

### Convenções de Commit
```
feat:    Nova feature
fix:     Correção de bug
docs:    Documentação
style:   Formatação
refactor: Refatoração
test:    Testes
chore:   Tarefas (deps, build, etc)
```

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Consulte a documentação em cada pasta
2. Verifique issues abertas no GitHub
3. Abra uma nova issue com detalhes do problema

---

## 📄 Licença

MIT License - veja LICENSE para detalhes

---

**Pronto para começar? Siga o guia de instalação acima!** 🚀
