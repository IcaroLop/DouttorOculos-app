# DouttorOculos - Sistema de Gerenciamento de Óticas

[![GitHub](https://img.shields.io/badge/GitHub-IcaroLop/DouttorOculos--app-blue?logo=github)](https://github.com/IcaroLop/DouttorOculos-app)
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)]()
[![React](https://img.shields.io/badge/React-18%2B-blue?logo=react)]()

## 📋 Descrição

**DouttorOculos** é um sistema completo de gerenciamento para óticas, desenvolvido com as melhores práticas de segurança e conformidade LGPD. Oferece funcionalidades para gerenciar clientes, produtos, vendas, estoque, receitas oftalmológicas e financeiro.

### Características Principais

✅ **Gestão de Clientes** - Cadastro, histórico e receitas oftalmológicas  
✅ **Controle de Estoque** - Alertas de reposição e movimentações  
✅ **Gestão de Vendas** - Orçamentos, pedidos sob medida e múltiplas formas de pagamento  
✅ **Financeiro** - Contas a pagar/receber e relatórios de faturamento  
✅ **Relatórios Gerenciais** - Vendas, estoque, performance e lucratividade  
✅ **Segurança LGPD** - Criptografia, controle de acesso e logs de auditoria  
✅ **Responsivo** - Desktop e mobile via browser  
✅ **PWA** - Funcionalidade offline e instalação como app  
✅ **Integrações** - WhatsApp, NF-e e gateways de pagamento  

---

## 🚀 Quick Start

### Pré-requisitos
- Node.js v18+
- npm ou yarn
- Git
- MySQL 8.0+ (em nuvem SaveInCloud)
- Python 3.9+ (para scripts auxiliares)

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/IcaroLop/DouttorOculos-app.git
cd DouttorOculos-app

# Instale as dependências do backend
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Instale as dependências do frontend
cd ../frontend-web
npm install

# Retorne à raiz
cd ..
```

### Executar em Desenvolvimento

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend-web
npm start
```

Acesse http://localhost:3000

---

## 📂 Estrutura do Projeto

```
DouttorOculos-app/
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── models/            # Modelos Sequelize/TypeORM
│   │   ├── routes/            # Rotas da API
│   │   ├── middleware/        # Autenticação, validação
│   │   ├── services/          # Lógica compartilhada
│   │   └── config/            # Configurações
│   ├── tests/                 # Testes unitários/integração
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend-web/
│   ├── src/
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── services/          # Chamadas à API
│   │   ├── redux/             # State management
│   │   ├── styles/            # Estilos globais
│   │   ├── utils/             # Funções utilitárias
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   └── index.html
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── Infraestrutura.md      # Arquitetura e deploy
│   ├── RegrasNegocio.md       # Regras de negócio
│   ├── API.md                 # Documentação da API
│   └── SETUP.md               # Guia de setup
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml             # CI/CD pipeline
│   │   └── deploy.yml         # Deploy automático
│   └── copilot-instructions.md
│
├── docker-compose.yml         # Desenvolvimento local
├── .env.example
├── README.md
└── package.json               # Scripts compartilhados
```

---

## 🏗️ Arquitetura

### Stack Tecnológico

**Backend**
- Node.js v18+
- Express.js
- TypeORM ou Sequelize
- JWT Authentication
- Redis (cache)

**Frontend**
- React 18+ com TypeScript
- Material-UI ou Ant Design
- Redux Toolkit
- Axios
- PWA (Service Workers)

**Database**
- MySQL 8.0.44
- SaveInCloud (Jelastic)
- Backup automático

**Infraestrutura**
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- CloudWatch/ELK (logs)

### Fluxo de Dados

```
[React Frontend] 
     ↓ HTTP/JWT
[Express API]
     ↓ SQL
[MySQL (SaveInCloud)]
     ↓ Cache
[Redis]
```

---

## 🔐 Segurança

### Implementado

✅ HTTPS/TLS 1.3 obrigatório  
✅ JWT com refresh tokens (15min expiry)  
✅ Senhas com bcrypt (12 salt rounds)  
✅ CPF criptografado (AES-256)  
✅ Rate limiting (100 req/min)  
✅ CORS configurado  
✅ SQL Injection prevention (parameterized queries)  
✅ LGPD compliance (direito ao esquecimento, auditoria)  
✅ Logs centralizados  
✅ Backup automático (diário + semanal)  

### Controle de Acesso

| Perfil | Permissões |
|--------|-----------|
| **Gerente** | Acesso total + aprovação de descontos |
| **Vendedor** | Vendas, estoque, visualizar receitas |
| **Ótico** | Gestão de receitas, orientações |
| **Atendente** | Cadastro básico, consultas |

---

## 📊 Database Schema

### Tabelas Principais

```
lojas
├── id (PK)
├── nome
├── cnpj
├── endereco
└── criado_em

usuarios
├── id (PK)
├── loja_id (FK)
├── email (unique)
├── senha_hash
├── cargo (enum: gerente, vendedor, otico, atendente)
└── ativo

clientes
├── id (PK)
├── loja_id (FK)
├── cpf (unique, encrypted)
├── email
├── telefone
└── criado_em

produtos
├── id (PK)
├── loja_id (FK)
├── codigo_sku (unique)
├── categoria (enum: armacao, lente, solucao, acessorio)
├── preco_venda
├── estoque
└── ativo

vendas
├── id (PK)
├── cliente_id (FK)
├── vendedor_id (FK)
├── total
├── metodo_pagamento
├── status (enum: pendente, concluida, cancelada)
└── criado_em

receitas
├── id (PK)
├── cliente_id (FK)
├── esfera_od, cilindro_od, eixo_od
├── esfera_oe, cilindro_oe, eixo_oe
├── distancia_pupilar
└── ativo
```

Ver schema completo: [Infraestrutura.md](./docs/Infraestrutura.md)

---

## 🔄 Integração com Banco de Dados

### Acesso ao MySQL (SaveInCloud)

```bash
# Via script Python (automático)
python mysql_ssh_client.py

# Via SSH manual
ssh -i ~/.ssh/id_rsa_douttoroculos 8187@gate.paas.saveincloud.net.br -p 3022
# Selecione: 3 (bolaovip-cs-backend)
# Selecione: 3 (MySQL CE)
```

**Informações de Conexão**
- Host: bolaovip-cs-backend.sp1.br.saveincloud.net.br
- MySQL: 8.0.44
- Banco Principal: douttoroculos
- SSH Gate: gate.paas.saveincloud.net.br:3022

---

## 🚢 Deployment

### Development

```bash
docker-compose up
```

Acesso:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- MySQL: localhost:3306

### Production

```bash
# Build Docker image
docker build -t douttoroculos-api:latest ./backend
docker build -t douttoroculos-web:latest ./frontend-web

# Push para registry
docker tag douttoroculos-api:latest your-registry/douttoroculos-api:latest
docker push your-registry/douttoroculos-api:latest

# Deploy (via GitHub Actions)
git push origin main
```

Ver guia completo: [Infraestrutura.md](./docs/Infraestrutura.md#deployment)

---

## 📚 Documentação

- **[Infraestrutura.md](./docs/Infraestrutura.md)** - Arquitetura, custos, deployment
- **[RegrasNegocio.md](./docs/RegrasNegocio.md)** - Regras de negócio do domínio
- **[API.md](./docs/API.md)** - Documentação das endpoints (a criar)
- **[SETUP.md](./docs/SETUP.md)** - Guia detalhado de setup (a criar)
- **[.github/copilot-instructions.md](.github/copilot-instructions.md)** - Instruções para IA/Copilot

---

## 🧪 Testes

```bash
# Backend
cd backend
npm test                # Testes unitários
npm run test:e2e       # Testes de integração

# Frontend
cd frontend-web
npm test               # Testes unitários/componentes
```

---

## 🔗 Integrações (Opcionais)

- **WhatsApp API** - Confirmação de vendas, lembretes
- **NF-e** - Integração fiscal automática
- **Payment Gateways** - Stripe, Square, Pagar.me
- **Laboratório 3º** - Rastreamento de pedidos

---

## 📝 Variáveis de Ambiente

```env
# Backend
NODE_ENV=development
DATABASE_URL=mysql://root:password@host:3306/douttoroculos
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
JWT_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

# Frontend
REACT_APP_API_URL=http://localhost:3001/api/v1
```

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Distribuído sob a licença MIT. Ver `LICENSE` para mais informações.

---

## 👥 Autores

- **Ícaro Lopes** - [@IcaroLop](https://github.com/IcaroLop)

---

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou envie um email.

---

**Última atualização**: 21 de Janeiro de 2026  
**Status**: Desenvolvimento Inicial ✅
