# Copilot Instructions for DouttorOculos

## Project Overview

**DouttorOculos** é um Sistema de Gerenciamento de Óticas com aplicações web e mobile, usando MySQL na nuvem (SaveInCloud/Jelastic).

## Infrastructure & Database

### Ambiente de Produção
- **Provedor**: SaveInCloud (Jelastic Platform)
- **MySQL Versão**: 8.0.44
- **Banco Principal**: `bolaovip`
- **Host**: bolaovip-cs-backend.sp1.br.saveincloud.net.br
- **Arquitetura**: Container Node.js (backend) + Container MySQL CE

### Acesso ao Banco
```bash
# Via script Python (recomendado)
python mysql_ssh_client.py

# Via SSH manual
ssh -i ~/.ssh/id_rsa_douttoroculos 8187@gate.paas.saveincloud.net.br -p 3022
# Opção 3: ambiente | Opção 3: MySQL container
```

⚠️ **Nota**: Port forwarding está bloqueado. Use comandos MySQL remotos via SSH.

## Architecture Patterns

### Stack Tecnológico Recomendado
- **Backend**: Node.js + Express
- **Frontend Web**: React 18+ com TypeScript (responsivo: desktop + mobile)
- **PWA**: Progressive Web App para melhor experiência mobile
- **Autenticação**: JWT com refresh tokens
- **Cache**: Redis (ElastiCache/Memorystore)
- **Storage**: S3-compatible para fotos de produtos/receitas
- **UI Components**: Material-UI ou Ant Design (responsivo)

### Estrutura de Dados (Schema MySQL)

**Domínio Principal**: Óticas
- `lojas` - Cadastro de lojas/filiais
- `usuarios` - Gerentes, vendedores, óticos, atendentes
- `clientes` - Cadastro de pacientes/clientes
- `produtos` - Armações, lentes, soluções, acessórios
- `vendas` + `itens_venda` - Transações e itens vendidos
- `receitas` - Prescrições oftalmológicas (OD/OE, grau esférico, cilindro, eixo, DNP)

**Convenções**:
- Todas as tabelas possuem `loja_id` para multi-tenancy
- Timestamps automáticos: `criado_em`
- Soft deletes via flag `ativo BOOLEAN`
- UTF-8MB4 para suporte a caracteres especiais

Ver schema completo em: [Infraestrutura.md](../Infraestrutura.md#configuração-do-banco-de-dados-mysql)

## Development Workflow

### Comandos Essenciais
```bash
# Instalar dependências Python (ambiente virtual)
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Conectar ao MySQL (produção)
python mysql_ssh_client.py

# Deploy (via GitHub Actions - a configurar)
git push origin main
```

### Arquivos Críticos
- [Infraestrutura.md](../Infraestrutura.md) - Arquitetura completa, custos, deployment
- [RegrasNegocio.md](../RegrasNegocio.md) - Regras de negócio do domínio de óticas
- `mysql_ssh_client.py` - Cliente SSH para acesso ao banco
- `conectar-mysql.ps1` - Script PowerShell auxiliar

## Code Conventions

### Segurança (LGPD Compliance)
- **Senhas**: Hash bcrypt (12 salt rounds)
- **CPF**: Criptografia adicional
- **Receitas médicas**: Acesso restrito (role-based)
- **HTTPS/TLS 1.3**: obrigatório em produção
- **Rate limiting**: 100 req/min por IP

### API Design
- RESTful com verbos HTTP semânticos
- JWT Bearer tokens (15min expiry + refresh tokens 7 dias)
- Validação de input com Joi/Pydantic
- Respostas padronizadas JSON
- Versionamento: `/api/v1/...`

### Padrões de Código
- **Multi-tenancy**: Sempre filtrar por `loja_id`
- **Soft Delete**: Usar `ativo = FALSE` ao invés de DELETE
- **Logs de Auditoria**: Registrar operações sensíveis (vendas, alterações de estoque)
- **Paginação**: Limite padrão 50 itens por página

## Integration Points

### Banco de Dados
- Conexão via Sequelize/TypeORM (Node) ou SQLAlchemy (Python)
- Connection pool: min 5, max 20 conexões
- Retry logic para falhas transitórias

### Armazenamento de Arquivos
- S3-compatible para imagens de produtos
- Bucket: `douttoroculos-media/`
- CDN (CloudFront/similar) para distribuição

### Monitoramento
- Logs centralizados (CloudWatch/ELK)
- Métricas: latência P95, taxa de erro, uptime
- Alertas: CPU > 80%, erro rate > 5%

## Domain-Specific Rules

### Receitas Oftalmológicas
- **Campos obrigatórios**: OD/OE (olho direito/esquerdo), esfera, cilindro, eixo
- **Validação**: Grau esférico -20.00 a +20.00, cilindro -6.00 a 0.00
- **Validade**: Receitas expiram após 1 ano (configurável)
- **Privacidade**: Apenas óticos e o cliente podem visualizar

### Gestão de Estoque
- **Alerta de estoque baixo**: < 5 unidades
- **Produtos com SKU único**: `codigo_sku` não pode duplicar
- **Categorias**: `armacao`, `lente`, `solucao`, `acessorio`

### Vendas
- **Métodos de pagamento**: dinheiro, credito, debito, pix
- **Desconto máximo**: Configurável por role (ex: gerente até 20%)
- **Status**: `pendente` → `concluida` ou `cancelada`

---

**Repositório**: [github.com/IcaroLop/DouttorOculos-app](https://github.com/IcaroLop/DouttorOculos-app)  
**Documentação completa**: Ver [Infraestrutura.md](../Infraestrutura.md) e [RegrasNegocio.md](../RegrasNegocio.md)
