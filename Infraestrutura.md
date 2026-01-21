# Infraestrutura - DouttorOculos

## Visão Geral da Arquitetura

DouttorOculos é um Sistema de Gerenciamento de Óticas com aplicações web e mobile, utilizando arquitetura **Cliente-Servidor com API RESTful** e banco de dados centralizado na nuvem.

```
┌──────────────────────────────────────────────────────────────┐
│              Camada de Apresentação (Frontend)                │
│   React 18+ (Desktop + Mobile Responsivo + PWA)              │
│  ┌──────────────┬──────────────┬────────────────┐            │
│  │   Desktop    │  Mobile Web  │  PWA (Offline) │            │
│  │   Browser    │   Browser    │  Capability    │            │
│  └──────────────┴──────────────┴────────────────┘            │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    Camada de API (Backend)                    │
│              Node.js + Express / Python + Django             │
│                   API RESTful com JWT Auth                    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   Camada de Dados (Nuvem)                     │
│   MySQL (RDS/Cloud SQL) + Redis Cache + Storage (S3/GCS)    │
└──────────────────────────────────────────────────────────────┘
```

## Stack Tecnológico Recomendado

### Backend
- **Runtime**: Node.js v18+ ou Python 3.10+
- **Framework**: Express.js (Node) ou FastAPI/Django (Python)
- **Autenticação**: JWT (JSON Web Tokens) com refresh tokens
- **Validação**: Joi/Yup (Node) ou Pydantic (Python)
- **ORM**: Sequelize/TypeORM (Node) ou SQLAlchemy (Python)

### Frontend Web (Desktop + Mobile Responsivo)
- **Framework**: React 18+ com TypeScript
- **State Management**: Redux Toolkit ou Zustand
- **UI Components**: Material-UI ou Ant Design (design responsivo)
- **HTTP Client**: Axios com interceptadores
- **Responsividade**: Mobile-first, breakpoints para tablets e desktops
- **PWA**: Service Workers, offline support, notificações push nativas

### PWA (Progressive Web App) - Recomendado para Mobile
- **Manifest.json**: Instalação como app nativo
- **Service Workers**: Cache estratégico, suporte offline
- **Web App Shell**: Interface carregada instantaneamente
- **Push Notifications**: Notificações nativas do navegador
- **Camera & Geolocation**: Acesso a APIs do dispositivo

### Banco de Dados
- **SGBD**: MySQL 8.0+
- **Provedor Cloud**: 
  - AWS RDS MySQL
  - Google Cloud SQL
  - Azure Database for MySQL
- **Caracteres**: UTF-8MB4 (suporte a emojis e caracteres especiais)

### Cache & Sessão
- **Redis**: Gerenciamento de sessões, cache de consultas frequentes
- **Provedor**: AWS ElastiCache, Google Cloud Memorystore, Azure Cache

### Storage de Arquivos
- **S3-Compatible**: AWS S3, Google Cloud Storage, MinIO (self-hosted)
- **Uso**: Fotos de produtos, receitas, documentos de pacientes

### DevOps & Deployment
- **Containerização**: Docker + Docker Compose
- **Orquestração**: Kubernetes (opcional) ou Heroku/Railway/Render
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins
- **Monitoramento**: Datadog, New Relic ou ELK Stack
- **Logs**: Winston (Node) ou Python logging + ELK

---

## Infraestrutura em Nuvem - Opção 1: AWS (Recomendado)

### Componentes Principais

```yaml
Compute:
  - EC2 (t3.medium para produção)
  - ALB (Application Load Balancer)
  - ECS/EKS (orquestração de containers)

Database:
  - RDS MySQL 8.0 (Multi-AZ para alta disponibilidade)
  - Backup automático (7 dias retenção)
  - Read Replicas para escalabilidade

Cache:
  - ElastiCache Redis (cache-optimized)
  - Auto-failover ativado

Storage:
  - S3 para documentos/imagens
  - Lifecycle policies (arquivar após 90 dias)

Network:
  - VPC com subnets públicas e privadas
  - Security Groups restritivos
  - WAF (Web Application Firewall)

CDN:
  - CloudFront para distribuição global de assets
```

### Custo Estimado Mensal (Inicial)
- EC2 t3.medium: ~$30/mês
- RDS MySQL db.t3.small (Multi-AZ): ~$150/mês
- ElastiCache Redis cache.t3.micro: ~$15/mês
- S3 + transferência: ~$10-30/mês
- **Total**: ~$205-225/mês

---

## Infraestrutura em Nuvem - Opção 2: Google Cloud (Alternativa)

```yaml
Compute:
  - Cloud Run (serverless, pague pelo uso)
  - Cloud Load Balancing

Database:
  - Cloud SQL MySQL (Altamente gerenciado)
  - Automated backups e replicação

Cache:
  - Memorystore (Redis gerenciado)

Storage:
  - Cloud Storage (compatível com S3)

Monitoring:
  - Cloud Logging & Monitoring nativo
```

### Custo Estimado: ~$150-200/mês

---

## Infraestrutura em Nuvem - Opção 3: Azure (Alternativa)

```yaml
Compute:
  - App Service (plano Standard)
  - Application Gateway

Database:
  - Azure Database for MySQL (Single Server/Flexible)
  - Geo-redundância opcional

Cache:
  - Azure Cache for Redis

Storage:
  - Blob Storage para documentos
```

### Custo Estimado: ~$180-220/mês

---

## Configuração do Banco de Dados MySQL

### Schema Base - Domínio de Óticas

```sql
-- Tabelas Principais
CREATE TABLE lojas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,
  endereco TEXT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  cargo ENUM('gerente', 'vendedor', 'otico', 'atendente') NOT NULL,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id)
);

CREATE TABLE clientes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefone VARCHAR(20),
  cpf VARCHAR(14) UNIQUE,
  data_nascimento DATE,
  endereco TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id)
);

CREATE TABLE produtos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  codigo_sku VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  categoria ENUM('armacao', 'lente', 'solucao', 'acessorio'),
  preco_custo DECIMAL(10, 2),
  preco_venda DECIMAL(10, 2) NOT NULL,
  estoque INT DEFAULT 0,
  imagem_url VARCHAR(500),
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id)
);

CREATE TABLE vendas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  cliente_id INT,
  vendedor_id INT NOT NULL,
  total DECIMAL(12, 2) NOT NULL,
  desconto DECIMAL(12, 2) DEFAULT 0,
  metodo_pagamento ENUM('dinheiro', 'credito', 'debito', 'pix') NOT NULL,
  status ENUM('pendente', 'concluida', 'cancelada') DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (vendedor_id) REFERENCES usuarios(id)
);

CREATE TABLE itens_venda (
  id INT PRIMARY KEY AUTO_INCREMENT,
  venda_id INT NOT NULL,
  produto_id INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(12, 2) NOT NULL,
  FOREIGN KEY (venda_id) REFERENCES vendas(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

CREATE TABLE receitas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  loja_id INT NOT NULL,
  cliente_id INT NOT NULL,
  otico_id INT NOT NULL,
  data_receita DATE NOT NULL,
  esfera_od DECIMAL(5, 2),
  cilindro_od DECIMAL(5, 2),
  eixo_od INT,
  esfera_oe DECIMAL(5, 2),
  cilindro_oe DECIMAL(5, 2),
  eixo_oe INT,
  adição DECIMAL(5, 2),
  distancia_pupilar INT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (loja_id) REFERENCES lojas(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (otico_id) REFERENCES usuarios(id)
);

-- Índices para Performance
CREATE INDEX idx_usuario_loja ON usuarios(loja_id);
CREATE INDEX idx_cliente_loja ON clientes(loja_id);
CREATE INDEX idx_produto_loja ON produtos(loja_id);
CREATE INDEX idx_venda_loja ON vendas(loja_id);
CREATE INDEX idx_venda_cliente ON vendas(cliente_id);
CREATE INDEX idx_receita_cliente ON receitas(cliente_id);
```

### Configurações Recomendadas MySQL

```sql
-- Charset UTF-8MB4 para suporte completo a caracteres especiais
ALTER DATABASE seu_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Variáveis de performance (ajuste conforme infraestrutura)
SET GLOBAL max_connections = 500;
SET GLOBAL innodb_buffer_pool_size = '2GB';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

---

## Segurança

### Autenticação & Autorização
- JWT com expiração de 15 minutos
- Refresh tokens com validade de 7 dias
- Senha com hash bcrypt (salt rounds: 12)
- CORS configurado apenas para domínios autorizados

### Dados em Trânsito
- HTTPS/TLS 1.3 obrigatório
- SSL/TLS em conexão com banco de dados
- Certificados gerenciados (Let's Encrypt / AWS ACM)

### Dados em Repouso
- Senhas criptografadas (bcrypt)
- Dados sensíveis (CPF) com criptografia adicional
- Backup automático com criptografia

### API Security
- Rate limiting (100 req/min por IP)
- Input validation e sanitização
- SQL Injection prevention (usar parameterized queries)
- CSRF tokens para operações POST/PUT/DELETE
- Content Security Policy (CSP) headers

### Compliance
- LGPD (Lei Geral de Proteção de Dados)
- HIPAA-like practices para dados de saúde
- Logs de auditoria para operações sensíveis

---

## Deployment

### Ambiente: Produção

#### Via Docker + Docker Compose
```yaml
version: '3.9'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://user:pass@db:3306/douttoroculos
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: douttoroculos
    volumes:
      - db_data:/var/lib/mysql
    restart: always

  cache:
    image: redis:7-alpine
    restart: always

volumes:
  db_data:
```

#### Deployment em AWS ECS/Fargate
- Push de imagem Docker para ECR
- Task Definition com recursos alocados
- Serviço ECS com Auto Scaling
- Health checks configurados

#### CI/CD com GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t api:latest .
      - name: Push to ECR
        run: aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REGISTRY
      - name: Deploy to ECS
        run: aws ecs update-service --cluster prod --service api --force-new-deployment
```

---

## Monitoramento & Observabilidade

### Métricas
- **CPU/Memória**: Alertas se > 80%
- **Requisições**: Taxa de erro > 5%
- **Latência**: Tempo de resposta P95 > 500ms
- **Banco de Dados**: Conexões ativas, queries lentas

### Logging
- Centralizado em CloudWatch / ELK
- Níveis: ERROR, WARN, INFO, DEBUG
- Rastreamento de requisições com correlation IDs

### Alertas
- Slack/Email para incidentes críticos
- Escalação automática em caso de pico de tráfego

---

## Escalabilidade

### Horizontal Scaling
- Load Balancer distribui tráfego entre múltiplas instâncias
- Auto Scaling Group: 2-10 instâncias conforme demanda
- Sessões armazenadas em Redis (stateless)

### Vertical Scaling
- Upgrade de instâncias conforme necessário
- Monitoramento contínuo de recursos

### Cache & Otimização
- Redis para sessões e cache de consultas
- CDN para assets estáticos
- Compressão gzip de respostas

---

## Conformidade e Regulamentações

### LGPD (Brasil)
- ✅ Consentimento explícito para coleta de dados
- ✅ Direito ao esquecimento (delete soft com retenção mínima)
- ✅ Dados de acesso e modificação auditados
- ✅ Criptografia de dados sensíveis

### Saúde
- ✅ Receitas protegidas com controle de acesso
- ✅ Prescrições armazenadas com validade temporal
- ✅ Histórico de paciente rastreável

---

## Banco de Dados em Produção (SaveInCloud / Jelastic)

### Informações de Conexão

```yaml
Provedor: SaveInCloud (Jelastic Platform)
Host Externo: bolaovip-cs-backend.sp1.br.saveincloud.net.br
Host Interno: 10.100.48.197 (LAN)
Porta MySQL: 3306
MySQL Versão: 8.0.44
Container: MySQL CE (nodeid: 254240)

Acesso SSH Gate:
  Host: gate.paas.saveincloud.net.br
  Porta: 3022
  Usuário SSH: 8187
  Autenticação: Chave SSH (id_rsa_douttoroculos)
```

### Bancos de Dados Disponíveis

- **bolaovip** - Banco principal do sistema
- **erp_estoque** - Sistema de gestão de estoque
- *(+ bancos de sistema MySQL)*

### Como Conectar

**Opção 1: Script Python Automatizado** (Recomendado)
```bash
python mysql_ssh_client.py
```

**Opção 2: SSH Manual**
```bash
ssh -i ~/.ssh/id_rsa_douttoroculos 8187@gate.paas.saveincloud.net.br -p 3022
# Selecione: 3 (ambiente bolaovip-cs-backend)
# Selecione: 3 (container MySQL CE)
# Execute: mysql -u root -p
```

**Opção 3: Aplicação com Conexão Direta**
```javascript
// Configuração para Node.js (via SSH Tunnel ou VPN)
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'bolaovip-cs-backend.sp1.br.saveincloud.net.br',
  port: 3306,
  user: 'root',
  password: process.env.DB_PASSWORD, // fBVhh6w2KW
  database: 'bolaovip'
});
```

### ⚠️ Limitações de Segurança

- ✅ **SSH Gate funciona** - Acesso via chave pública configurada
- ❌ **Port Forwarding bloqueado** - Não é possível usar `-L` para tunnel local
- ❌ **MySQL direto bloqueado** - Porta 3306 não acessível externamente
- ✅ **Solução**: Executar comandos MySQL remotamente via SSH ou usar script Python

### Arquitetura Real do Ambiente

```
┌──────────────────────────────────────────────────────────┐
│          bolaovip-cs-backend (SaveInCloud)               │
├─────────────────────┬────────────────────────────────────┤
│  Container Node.js  │       Container MySQL CE           │
│  (Backend API)      │       (Banco de Dados)            │
│  nodeid: 254241     │       nodeid: 254240              │
│  IP: 10.100.74.71   │       IP: 10.100.48.197           │
│  WAN: 191.243.196.240│      WAN: - (privado)            │
└─────────────────────┴────────────────────────────────────┘
                            ↓
        Acesso via SSH Gate (porta 3022)
     gate.paas.saveincloud.net.br:3022
```

---

**Status**: ✅ Conectado e operacional. Schema do DouttorOculos será criado no banco `bolaovip`.
