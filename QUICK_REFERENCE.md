# Quick Reference - DouttorOculos (Para IAs)

**Data:** 21 Jan 2026  
**Status:** ✅ Backend e Frontend compilando sem erros

## Stack
- **Backend:** Node.js 18 + TypeScript + Express + TypeORM + MySQL 8.0
- **Frontend:** React 18 + TypeScript + Redux Toolkit + Material-UI v5 + Vite
- **Auth:** JWT (access 15min + refresh 7d)
- **Multi-tenancy:** Via header `x-portal` e coluna `lojaId` em todas tabelas

## Comandos Rápidos

```bash
# Build (verificar erros)
cd backend && npm run build
cd frontend-web && npm run build

# Dev (com hot-reload)
cd backend && npm run dev          # Porta 3000
cd frontend-web && npm run dev     # Porta 5173

# Docker
docker-compose up                  # MySQL + Backend + Frontend
```

## Arquivos Importantes

- **STATUS_IMPLEMENTACAO.md** - Status completo, o que foi feito, TODOs
- **.github/copilot-instructions.md** - Contexto para IAs
- **RegrasNegocio.md** - Business rules do domínio de óticas
- **Infraestrutura.md** - Arquitetura, deploy, custos cloud

## O Que Está Implementado ✅

### Backend (24 endpoints API)
- 7 entidades TypeORM: User, Loja, Cliente, Produto, Receita, Venda, ItemVenda
- 5 services: auth, cliente, produto, receita, venda
- Validação Joi em todos endpoints
- Soft delete em todas entidades
- Auto-decremento de estoque em vendas

### Frontend (5 páginas)
- Login (portal + username + password)
- Dashboard (protegida)
- ListarClientes (tabela + busca)
- ListarProdutos (tabela + filtros + alerta estoque)
- ListarVendas (tabela + status chips)
- 4 Redux slices: auth, cliente, produto, venda
- 6 API services tipados

## TODOs Críticos ⚠️

1. **Portal → LojaId Mapping** (ALTA)
   - Atual: `lojaId = 1` hardcoded
   - Necessário: Criar `getLojaIdFromPortal(portal)` service
   - Arquivos: Todos os controllers (*Controller.ts)

2. **Autorização por Cargo** (MÉDIA)
   - Atual: JWT tem `cargo` mas nenhuma validação
   - Necessário: Middleware `requireRole(['gerente', 'otico'])`
   - Exemplo: Apenas ótico pode criar receitas

3. **Forms de Criação/Edição** (ALTA UX)
   - Faltam: FormCliente, FormProduto, FormReceita, FormVenda
   - Usar: react-hook-form + Yup validation

## Convenções de Código

### Backend
```typescript
// Controllers: async, try/catch, delegate to service
export async function createCliente(req, res, next) {
  try {
    const result = await clienteService.criar(req.body);
    return res.status(201).json(result);
  } catch (err) {
    return next(err); // errorHandler captura
  }
}

// Services: lógica de negócio, throw Error com .status
export async function criar(data) {
  // Validação
  if (await cpfJaExiste(data.cpf)) {
    const error: any = new Error('CPF já cadastrado');
    error.status = 400;
    throw error;
  }
  // Criar
  return await repo().save(data);
}
```

### Frontend
```typescript
// Redux: dispatch + selector
const dispatch = useAppDispatch();
const clientes = useAppSelector(selectClientes);

useEffect(() => {
  async function carregar() {
    dispatch(setLoading(true));
    const data = await clienteService.listar();
    dispatch(setClientes(data));
  }
  carregar();
}, []);

// API: usar service files, não axios direto
await clienteService.criar({ nome, cpf, telefone });
```

## Padrões de Dados

### Multi-tenancy
```sql
-- TODAS as tabelas têm lojaId
SELECT * FROM clientes WHERE lojaId = 1 AND ativo = TRUE;
```

### Soft Delete
```typescript
// Não usar DELETE físico
await repo().update(id, { ativo: false });
```

### Validação Joi
```typescript
// schemas.ts
export const createClienteSchema = Joi.object({
  nome: Joi.string().min(3).max(255).required(),
  cpf: Joi.string().pattern(/^\d{11}$/).required(),
  telefone: Joi.string().min(10).max(20).required(),
  email: Joi.string().email().optional(),
});

// routes
router.post('/', validateBody(createClienteSchema), createCliente);
```

## Login Flow
1. POST `/api/v1/auth/login` com `{ portal, username, password }`
2. Backend valida, retorna `{ accessToken, refreshToken, user }`
3. Frontend salva em Redux + localStorage
4. Toda requisição usa header `Authorization: Bearer {accessToken}` e `x-portal: {portal}`
5. Em 401, auto-refresh via `/api/v1/auth/refresh`

## Database (MySQL SaveInCloud)
- Host: `bolaovip-cs-backend.sp1.br.saveincloud.net.br:3306`
- DB: `bolaovip`
- Charset: `utf8mb4_unicode_ci`
- TypeORM: `synchronize: true` em dev (auto-sync entidades)

## Próximas Tarefas (Ordem)
1. ✅ Build backend/frontend sem erros (CONCLUÍDO)
2. ⚠️ Implementar portal→lojaId mapping
3. ⚠️ Criar FormCliente + FormProduto + FormVenda
4. ❌ Adicionar guards de autorização
5. ❌ Implementar Dashboard analítico
6. ❌ Sistema de pedidos sob medida
7. ❌ Testes automatizados

## Contexto de Domínio
**DouttorOculos** = Sistema de gestão de óticas (optical stores)

**Entidades principais:**
- **Loja** - Filial/branch da rede de óticas
- **Cliente** - Paciente/comprador (CPF único)
- **Produto** - Armações, lentes, soluções, acessórios
- **Receita** - Prescrição oftalmológica (OD/OE: esfera, cilindro, eixo)
- **Venda** - Transação comercial (pendente → concluída/cancelada)
- **ItemVenda** - Line items da venda

**Cargos (JWT):**
- **gerente** - Acesso total, aprova descontos
- **vendedor** - Vendas, consulta estoque
- **otico** - Cria/edita receitas
- **atendente** - Cadastro básico

**Regras de negócio:**
- Receita válida por 1 ano
- Estoque decrementa ao criar venda, reverte ao cancelar
- CPF único por tenant (lojaId)
- SKU único por tenant
- Soft delete (ativo = FALSE)

---

📖 **Documentação completa:** Ver `STATUS_IMPLEMENTACAO.md` e `.github/copilot-instructions.md`
